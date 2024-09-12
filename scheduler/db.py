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


def get_to_do() -> list[ScheduleAction]:
    return [
        ScheduleAction.from_list(k)
        for k in session.execute(
            text(
                """
                    select
                        a.id as schedule_id,
                        a.name as schedule_name,
                        a.zone_name as zone_name,
                        b.id as action_id,
                        b.water_level,
                        b.dose_number,
                        b.dose_amount,
                        b.mixing_time,
                        b.routing_time,
                        b.compressing_time,
                        (dd :: date + interval '1 hour' * b.hour) AS scheduled_date
                    from
                        scheduler.jobs a
                        JOIN LATERAL generate_series(a.start_date, a.end_date, '1 day' :: interval) dd ON true
                        JOIN scheduler.jobs_actions b ON a.id = b.job_id
                        left join scheduler.events_logs c on a.id = c.job_id
                        and c.action_id = b.id
                        and c.job_full_date = (dd :: date + interval '1 hour' * b.hour)
                    where
                        (dd :: date + interval '1 hour' * b.hour) <= now()
                        and c.process_start is null
                    order by
                        (dd :: date + interval '1 hour' * b.hour)
                """
            )
        ).fetchall()
    ]


print(get_to_do())
