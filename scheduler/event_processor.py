from db import ScheduleAction
from hub_commands import HubCommandManager
from logger import logger as logging


class EventProcessor:
    def __init__(self, hub_command: HubCommandManager):
        self.command_manager = hub_command

    def process_event(self, event: ScheduleAction):
        try:
            logging.info("Starting Task :")
            logging.info(event)
            # FILL WATER
            logging.info(f"Filling Water tank to level: {event.water_level}")
            self.command_manager.fill_water(event.water_level)
            logging.info("Water tank filled")
            # DOSE1
            logging.info(f"Dosing num: 1 amount: {event.dose_1}")
            if event.dose_1 > 0:
                self.command_manager.dose(1, event.dose_1)
                logging.info("Dosing 1 done")
            else:
                logging.info("Dosing 1 ignored")

            # DOSE2
            logging.info(f"Dosing num: 2 amount: {event.dose_2}")
            if event.dose_2 > 0:
                self.command_manager.dose(2, event.dose_2)
                logging.info("Dosing 2 done")
            else:
                logging.info("Dosing 2 ignored")

            # DOSE3
            logging.info(f"Dosing num: 3 amount: {event.dose_3}")
            if event.dose_3 > 0:
                self.command_manager.dose(3, event.dose_3)
                logging.info("Dosing 3 done")
            else:
                logging.info("Dosing 3 ignored")

            # DOSE4
            logging.info(f"Dosing num: 4 amount: {event.dose_4}")
            if event.dose_4 > 0:
                self.command_manager.dose(4, event.dose_4)
                logging.info("Dosing 4 done")
            else:
                logging.info("Dosing 4 ignored")

            # MIX
            logging.info(f"Mixing for {event.mixing_time}")
            self.command_manager.mix(event.mixing_time)
            logging.info("Mixing done")
            # ROUTE
            logging.info(
                f"Routing to {event.zone_name} for {event.routing_time} and then compressing for {event.compressing_time}"
            )
            self.command_manager.route(
                event.zone_name, event.routing_time, event.compressing_time
            )
            logging.info("Compression & Routing done")
        except Exception as e:
            logging.error(f"Error while executing command {e}")
            raise e
