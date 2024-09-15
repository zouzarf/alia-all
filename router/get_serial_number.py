serial_number = None
from Phidget22.Devices.Manager import Manager
from Phidget22.Phidget import Phidget


def attached(manager, sensor):
    global serial_number
    serial_number = sensor.getDeviceSerialNumber()


def get_serial_number():
    global serial_number
    manager = Manager()
    manager.setOnAttachHandler(attached)
    manager.open()
    l = None
    while serial_number is None:
        pass
    return serial_number
