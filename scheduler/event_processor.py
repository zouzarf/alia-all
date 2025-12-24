from db import ScheduleAction
from hub_commands import HubCommandManager, RoutingCommand
from logger import logger as logging


class EventProcessor:
    def __init__(self, hub_command: HubCommandManager):
        self.command_manager = hub_command

    def process_event(self, event: ScheduleAction):
        try:
            logging.info("Starting Task :")
            logging.info(event)
            # ROUTE
            logging.info(
                f"Routing to {event.zone_name} with pump {event.water_pump} for {event.routing_time} and then compressing for {event.compressing_time}"
            )
            self.command_manager.route(
                RoutingCommand(
                    event.water_pump,
                    event.zone_name,
                    event.warmup_pump,
                    event.routing_time,
                    event.warmup_compressor,
                    event.compressing_time,
                )
            )
            logging.info("Routing done")
        except Exception as e:
            logging.error(f"Error while executing command {e}")
            raise e
