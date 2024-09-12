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


class EventsLogs(Base):
    __tablename__ = "events_logs"
    __table_args__ = {"schema": "scheduler"}
    id: Mapped[int] = mapped_column(primary_key=True)
    job_id: Mapped[int] = mapped_column()
    action_id: Mapped[int] = mapped_column()
    job_full_date: Mapped[datetime] = mapped_column()
    process_start: Mapped[datetime] = mapped_column()
    process_end: Mapped[datetime] = mapped_column()
    status: Mapped[str] = mapped_column()


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


class ScheduleAction(BaseModel):
    @classmethod
    def from_list(cls, tpl):
        return cls(**{k: v for k, v in zip(cls.model_fields.keys(), tpl)})

    schedule_id: int
    schedule_name: str
    zone_name: str
    action_id: int
    water_level: int
    dose_number: int
    dose_amount: int
    mixing_time: int
    routing_time: int
    compressing_time: int
    scheduled_date: datetime


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
