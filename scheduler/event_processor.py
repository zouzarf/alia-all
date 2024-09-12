from datetime import datetime
from db import ScheduleAction
from hub_commands import HubCommand
from logger import logger as logging


class EventProcessor:
    def __init__(self, hub_command: HubCommand):
        self.command_manager = hub_command

    def process_event(self, event: ScheduleAction):
        try:
            logging.info("Starting Task :")
            logging.info(event)
            # FILL WATER
            logging.info(f"Filling Water tank to level: {event.water_level}")
            self.command_manager.fill_water(event.water_level)
            logging.info("Water tank filled")
            # DOSE
            logging.info(f"Dosing num: {event.dose_amount} amount: {event.dose_amount}")
            self.command_manager.dose(event.dose_amount, event.dose_amount)
            logging.info("Dosing done")
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
