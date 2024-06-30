from dataclasses import dataclass

RELOAD_COMMAND = "a"
FILL_WATER_COMMAND = "b"
DOSE_COMMAND = "c"
MIX_COMMAND = "d"
ROUTE_COMMAND = "e"


@dataclass
class HubCommand:
    command: str
    action: str
    value: str
