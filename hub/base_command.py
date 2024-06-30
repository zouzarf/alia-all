from dataclasses import dataclass


@dataclass
class ControllerCommand:
    actionner: str
    command: str
