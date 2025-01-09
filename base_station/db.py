from datetime import datetime
import logging
from pydantic.dataclasses import dataclass
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
import os
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


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


class BaseStationConfig(Base):
    __tablename__ = "base_station_ports"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    microprocessor_port: Mapped[int] = mapped_column()
    hub_port: Mapped[int] = mapped_column()


class HardwareHealth(Base):
    __tablename__ = "hardware"
    __table_args__ = {"schema": "health"}
    name: Mapped[str] = mapped_column(String(255), primary_key=True)
    heartbeat: Mapped[datetime] = Column(DateTime(timezone=True))


rasp_server = os.environ["rasp_server"]
engine = db.create_engine(
    f"postgresql://postgres:mysecretpassword@{rasp_server}:5432/postgres"
)
Session = sessionmaker(bind=engine)
session = Session()
engine2 = db.create_engine(
    f"postgresql://postgres:mysecretpassword@{rasp_server}:5432/postgres"
)
Session2 = sessionmaker(bind=engine2)
session2 = Session2()


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
                producer="BaseStation",
                module_name=filename,
                ts=tm,
                log_level=levelname,
                log_message=message,
            )
        )
        self.connection.commit()

    def close(self):
        super().close()
