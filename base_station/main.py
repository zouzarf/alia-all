from controllers.base_station import BaseStation
from mqtt_config import client
from prisma.models import base_station_ports
import prisma


def main() -> None:

    prisma.register(prisma.Prisma())
    t = base_station_ports.prisma().find_many()
    base_station = BaseStation(t)
    print(t)


if __name__ == "__main__":
    main()
