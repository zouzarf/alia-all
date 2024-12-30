from datetime import datetime
import time
from db import EventsLogs, ScheduleAction
from event_processor import EventProcessor
from sqlalchemy.sql import text
from db import session
from logger import logger as logging

SCAN_INTERVAL = 10


class Scheduler:
    def __init__(self, event_processor: EventProcessor):
        self.event_processor = event_processor
        self.db_session = session

    def get_tasks(self) -> list[ScheduleAction]:
        db_list = self.db_session.execute(
            text(
                """
                    select
                        a.id as schedule_id,
                        a.name as schedule_name,
                        a.zone_name as zone_name,
                        b.id as action_id,
                        b.water_level,
                        b.dose_number,
                        b.dose_amount,
                        b.mixing_time,
                        b.routing_time,
                        b.compressing_time,
                        (dd :: date + interval '1 hour' * b.hour) AS scheduled_date
                    from
                        scheduler.jobs a
                        JOIN LATERAL generate_series(a.start_date, a.end_date, '1 day' :: interval) dd ON true
                        JOIN scheduler.jobs_actions b ON a.id = b.job_id
                        left join scheduler.events_logs c on a.id = c.job_id
                        and c.action_id = b.id
                        and c.job_full_date = (dd :: date + interval '1 hour' * b.hour)
                    where
                        (dd :: date + interval '1 hour' * b.hour) <= now()
                        and c.process_start is null
                    order by
                        (dd :: date + interval '1 hour' * b.hour)
                    limit 1
                """
            )
        ).fetchall()
        logging.info(db_list)
        return [ScheduleAction.from_list(k) for k in db_list]

    def run(self):
        while True:
            try:
                logging.info("Scanning tasks ...")
                tasks = self.get_tasks()
                logging.info(f"Tasks to do {len(tasks)}")
                for task in tasks:
                    start_time = datetime.now()
                    try:
                        self.event_processor.process_event(task)
                        end_time = datetime.now()
                        logging.info("Saving task log...")
                        # DO STUFF
                        self.db_session.add(
                            EventsLogs(
                                job_id=task.schedule_id,
                                action_id=task.action_id,
                                job_full_date=task.scheduled_date,
                                process_start=start_time,
                                process_end=end_time,
                                status="COMPLETE",
                            )
                        )
                        self.db_session.commit()
                        logging.info("Saving done")
                    except Exception as e:
                        logging.error(e)
                logging.info("All tasks executed. Sleeping...")
                time.sleep(SCAN_INTERVAL)
            except Exception as e:
                logging.error(e)
