import logging
import time
import sqlalchemy as db
from sqlalchemy.sql import text
from sqlalchemy import String, Integer
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from datetime import datetime
from pydantic import BaseModel


class Base(DeclarativeBase):
    pass


class GeneralConfig(Base):
    __tablename__ = "general_config"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    value: Mapped[str] = mapped_column()


class Logs(Base):
    __tablename__ = "logs"
    __table_args__ = {"schema": "live"}
    id: Mapped[int] = mapped_column(primary_key=True)
    ts: Mapped[datetime] = mapped_column()
    log_level: Mapped[str] = mapped_column()
    producer: Mapped[str] = mapped_column()
    log_message: Mapped[str] = mapped_column()
    module_name: Mapped[str] = mapped_column()


class Irrigation(Base):
    __tablename__ = "irrigation"
    __table_args__ = {"schema": "scheduler"}
    id: Mapped[int] = mapped_column(primary_key=True)
    schedule_name: Mapped[str] = mapped_column()
    zone_name: Mapped[str] = mapped_column()
    date: Mapped[datetime] = mapped_column()
    water_level: Mapped[int] = mapped_column()
    dose_1: Mapped[int] = mapped_column()
    dose_2: Mapped[int] = mapped_column()
    dose_3: Mapped[int] = mapped_column()
    dose_4: Mapped[int] = mapped_column()
    mixing_time: Mapped[int] = mapped_column()
    routing_time: Mapped[int] = mapped_column()
    compressing_time: Mapped[int] = mapped_column()
    process_start: Mapped[datetime] = Column(DateTime(timezone=True), nullable=True)
    process_end: Mapped[datetime] = Column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column()


class ServiceHealth(Base):
    __tablename__ = "services"
    __table_args__ = {"schema": "health"}
    name: Mapped[str] = mapped_column(String(255), primary_key=True)
    heartbeat: Mapped[datetime] = Column(DateTime(timezone=True))


engine = db.create_engine(
    "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
)
Session = sessionmaker(bind=engine)
session = Session()
engine2 = db.create_engine(
    f"postgresql://postgres:mysecretpassword@localhost:5432/postgres"
)
Session2 = sessionmaker(bind=engine2)
session2 = Session2()


class ScheduleAction(BaseModel):
    @classmethod
    def from_list(cls, tpl):
        return cls(**{k: v for k, v in zip(cls.model_fields.keys(), tpl)})

    id: int
    schedule_name: str
    zone_name: str
    date: datetime
    water_level: int
    dose_1: int
    dose_2: int
    dose_3: int
    dose_4: int
    mixing_time: int
    routing_time: int
    compressing_time: int
    status: str


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
