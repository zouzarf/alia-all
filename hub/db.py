import logging
import sqlalchemy as db
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker
import logging
import time
import sqlalchemy as db
from sqlalchemy.sql import text
from sqlalchemy import String, Integer
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from pydantic import BaseModel


class Base(DeclarativeBase):
    pass


class GeneralConfig(Base):
    __tablename__ = "general_config"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    value: Mapped[str] = mapped_column()


class RoutingConfig(Base):
    __tablename__ = "routes"
    __table_args__ = {"schema": "config"}
    id: Mapped[int] = mapped_column(String(30), primary_key=True)
    src: Mapped[str] = mapped_column()
    dst: Mapped[str] = mapped_column()
    valve_microprocessor_port: Mapped[int] = mapped_column()
    valve_hub_port: Mapped[int] = mapped_column()


class RoutersConfig(Base):
    __tablename__ = "routers"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    mac_address: Mapped[str] = mapped_column()
    pump_microprocessor_port: Mapped[int] = mapped_column()
    pump_hub_port: Mapped[int] = mapped_column()
    linked_to_base_station: Mapped[bool] = mapped_column()


class Logs(Base):
    __tablename__ = "logs"
    __table_args__ = {"schema": "live"}
    id: Mapped[int] = mapped_column(primary_key=True)
    ts: Mapped[datetime] = mapped_column()
    log_level: Mapped[str] = mapped_column()
    producer: Mapped[str] = mapped_column()
    log_message: Mapped[str] = mapped_column()
    module_name: Mapped[str] = mapped_column()


engine = db.create_engine(
    "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
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
                producer="Scheduler",
                module_name=filename,
                ts=tm,
                log_level=levelname,
                log_message=message,
            )
        )
        self.connection.commit()

    def close(self):
        super().close()
