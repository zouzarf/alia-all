import sqlalchemy as db
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker


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


engine = db.create_engine(
    "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
)
Session = sessionmaker(bind=engine)
session = Session()

general_config = {i.name: i.value for i in session.query(GeneralConfig).all()}
routing_config = session.query(RoutingConfig).all()
main_router = (
    session.query(RoutersConfig)
    .where(RoutersConfig.linked_to_base_station == True)
    .one()
)
print(general_config)
print(routing_config)
print(main_router)
