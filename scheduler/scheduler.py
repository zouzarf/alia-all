from datetime import datetime
import time
from db import Irrigation, ScheduleAction
from event_processor import EventProcessor
from sqlalchemy.sql import text
from db import session
from logger import logger as logging
from zoneinfo import ZoneInfo

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
                        id,
                        schedule_name,
                        zone_name,
                        date,
                        water_level,
                        dose_1,
                        dose_2,
                        dose_3,
                        dose_4,
                        mixing_time,
                        routing_time,
                        compressing_time,
                        status
                    from
                        scheduler.irrigation a
                    where
                        date <= now()
                        and a.status = 'TODO'
                    order by
                        date
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
                    start_time = datetime.now(ZoneInfo("UTC"))
                    try:
                        self.event_processor.process_event(task)
                        end_time = datetime.now(ZoneInfo("UTC"))
                        logging.info("Saving task log...")
                        # DO STUFF
                        self.db_session.query(Irrigation).filter(
                            Irrigation.id == task.id
                        ).update(
                            {
                                Irrigation.process_start: start_time,
                                Irrigation.process_end: end_time,
                                Irrigation.status: "DONE",
                            },
                            synchronize_session=False,
                        )
                        self.db_session.commit()
                        logging.info("Saving done")
                    except Exception as e:
                        logging.error(e)
                logging.info("All tasks executed. Sleeping...")
                time.sleep(SCAN_INTERVAL)
            except Exception as e:
                logging.error(e)
