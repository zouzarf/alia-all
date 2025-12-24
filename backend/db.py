from datetime import datetime
import logging
import os
import sqlalchemy as db
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker

rasp_server = "localhost"
MQTT_SERVER_IP = rasp_server
serial_number = "1001"


class Base(DeclarativeBase):
    pass


class Logs(Base):
    __tablename__ = "logs"
    __table_args__ = {"schema": "live"}
    id: Mapped[int] = mapped_column(primary_key=True)
    ts: Mapped[datetime] = mapped_column()
    log_level: Mapped[str] = mapped_column()
    producer: Mapped[str] = mapped_column()
    log_message: Mapped[str] = mapped_column()
    module_name: Mapped[str] = mapped_column()


class GeneralConfig(Base):
    __tablename__ = "general_config"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    value: Mapped[str] = mapped_column()


class RoutesConfig(Base):
    __tablename__ = "routes"
    __table_args__ = {"schema": "config"}
    id: Mapped[int] = mapped_column(String(30), primary_key=True)
    src: Mapped[str] = mapped_column()
    dst: Mapped[str] = mapped_column()
    hub_serial_number: Mapped[str] = mapped_column()
    hub_port: Mapped[str] = mapped_column()
    relay_channel: Mapped[str] = mapped_column()


class RoutersConfig(Base):
    __tablename__ = "routers"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    serial_number: Mapped[str] = mapped_column()
    base_station_valve_port1: Mapped[int] = mapped_column()
    base_station_valve_port2: Mapped[int] = mapped_column()
    linked_to_base_station: Mapped[bool] = mapped_column()


class HardwareHealth(Base):
    __tablename__ = "hardware"
    __table_args__ = {"schema": "health"}
    name: Mapped[str] = mapped_column(String(255), primary_key=True)
    heartbeat: Mapped[datetime] = Column(DateTime(timezone=True))


class WirelessHubs(Base):
    __tablename__ = "wireless_hubs"
    __table_args__ = {"schema": "config"}
    ip: Mapped[str] = mapped_column(String(255), primary_key=True)


class BaseStationPorts(Base):
    __tablename__ = "base_station_ports"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    hub_serial_number: Mapped[str] = mapped_column()
    hub_port: Mapped[int] = mapped_column()
    relay_channel: Mapped[int] = mapped_column()


engine = db.create_engine(
    f"postgresql://postgres:mysecretpassword@localhost:5432/postgres"
)
Session = sessionmaker(bind=engine)
session = Session()


class DBHandler(logging.Handler):
    def __init__(self):
        super().__init__()
        self.connection = session

    def emit(self, record):
        filename = record.filename
        tm = datetime.fromtimestamp(record.created).strftime("%Y-%m-%d %H:%M:%S.%f")
        levelname = record.levelname
        message = record.getMessage()
        self.connection.add(
            Logs(
                producer=f"Router-{serial_number}",
                module_name=filename,
                ts=tm,
                log_level=levelname,
                log_message=message,
            )
        )
        self.connection.commit()
