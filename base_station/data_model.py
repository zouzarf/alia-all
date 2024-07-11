from sqlalchemy import Column, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class Base(DeclarativeBase):
    pass


class BaseStationConfig(Base):
    __tablename__ = "base_station_ports"
    __table_args__ = {"schema": "config"}
    name: Mapped[str] = mapped_column(String(30), primary_key=True)
    microprocessor_port: Mapped[int] = mapped_column()
    hub_port: Mapped[int] = mapped_column()
