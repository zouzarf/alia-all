import time
from prisma import Prisma
from prisma.models import routers, routes
from datetime import datetime
from pydantic import BaseModel
from mqtt_config import client


SCAN_INTERVAL = 10
MQTT_SERVER_IP = "127.0.01"


class ScheduleAction(BaseModel):
    schedule_id: int
    schedule_name: str
    zone_id: int
    action_id: int
    water_level: int
    dose_number: int
    mixing_time: int
    compressing_time: int
    scheduled_date: datetime


db = Prisma()
db.connect()
non_processed_events = db.query_raw(
    """
        select
            a.id as schedule_id,
            a.name as schedule_name,
            a.zone_id as zone_id,
            b.id as action_id,
            b.water_level,
            b.dose_number,
            b.mixing_time,
            b.routing_time,
            b.compressing_time,
            (dd :: date + interval '1 hour' * b.hour) AS scheduled_date
        from
            scheduler.schedules a
            JOIN LATERAL generate_series(a.start_date, a.end_date, '1 day' :: interval) dd ON true
            JOIN scheduler.daily_schedule_actions b ON a.id = b.schedule_id
            left join scheduler.events c on a.id = c.schedule_id
            and c.daily_action_id = b.id
            and c.schedule_date = (dd :: date + interval '1 hour' * b.hour)
        where
            (dd :: date + interval '1 hour' * b.hour) <= now()
            and c.process_start is null
        order by
            (dd :: date + interval '1 hour' * b.hour)
    """,
    model=ScheduleAction,
)


def on_connect(client, userdata, flags, rc):
    print("-- base station -- Connected with result code " + str(rc))
    client.subscribe("base_station")


client.on_connect = on_connect
client.connect(MQTT_SERVER_IP)
while True:
    print("Scanning DB ...")
    for event in non_processed_events:
        started_event = db.events.create(
            {
                "schedule_id": event.schedule_id,
                "daily_action_id": event.action_id,
                "schedule_date": event.scheduled_date,
                "process_start": datetime.now(),
            }
        )
        # DO STUFF
        db.events.update(
            where={"id": started_event.id}, data={"process_end": datetime.now()}
        )
    print("Done")
    time.sleep(SCAN_INTERVAL)
