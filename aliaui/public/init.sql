DROP SCHEMA IF EXISTS config CASCADE;

DROP SCHEMA IF EXISTS scheduler CASCADE;

DROP SCHEMA IF EXISTS live CASCADE;

DROP SCHEMA IF EXISTS health CASCADE;

create schema if not exists config;

create schema if not exists scheduler;

create schema if not exists live;

create schema if not exists health;

CREATE TABLE config.nodes (node_name varchar(255) not null unique);

create table config.general_config (
    name varchar(255) not null UNIQUE,
    value varchar(255)
);

INSERT INTO
    config.general_config
VALUES
    ('WATER_OFFSET_L', '1'),
    ('WATER_AMP_COEFF', '625'),
    ('WATER_AMP_OFFSET', '0.00419'),
    ('WATER_MAX_LEVEL', '10'),
    ('SCHEDULER', 'false'),
    ('DOSING_TIME', '10');

create table config.base_station_ports (
    name varchar(255) not null UNIQUE,
    microprocessor_port int,
    hub_port int
);

INSERT INTO
    config.base_station_ports
VALUES
    ('WATERSENSOR', 4, null),
    ('WATERPUMP', 0, 1),
    ('DOSINGPUMP1', 0, 2),
    ('DOSINGPUMP2', 0, 3),
    ('DOSINGPUMP3', 0, 0),
    ('DOSINGPUMP4', 1, 0),
    ('MIXINGPUMP', 1, 1),
    ('COMPRESSOR', 1, 2),
    ('ROUTINGPUMP', 1, 3);

create table config.zones (
    name varchar(255) not null unique REFERENCES config.nodes(node_name)
);

create table config.routers (
    name varchar(255) not null unique REFERENCES config.nodes(node_name),
    serial_number varchar(255) unique,
    pump_microprocessor_port int,
    pump_hub_port int,
    linked_to_base_station boolean
);

create table config.routes (
    id SERIAL not null unique,
    src varchar(255),
    dst varchar(255),
    valve_microprocessor_port int,
    valve_hub_port int,
    UNIQUE (src, dst)
);

create table scheduler.irrigation (
    id SERIAL not null unique,
    schedule_name varchar(255) not null,
    zone_name varchar(255) not null,
    date timestamptz not null,
    water_level int,
    dose_1 int,
    dose_2 int,
    dose_3 int,
    dose_4 int,
    mixing_time int,
    routing_time int,
    compressing_time int,
    process_start timestamptz,
    process_end timestamptz,
    status varchar(255)
);

create table scheduler.events_logs (
    id SERIAL not null unique,
    job_id int,
    action_id int,
    job_full_date timestamptz,
    process_start timestamptz,
    process_end timestamptz,
    status varchar(255)
);

create table live.logs (
    id SERIAL not null unique,
    producer varchar(255),
    ts timestamptz DEFAULT now(),
    module_name varchar(255),
    log_level varchar(255),
    log_message varchar(20000)
);

create table health.services(
    name varchar(255) not null unique,
    heartbeat timestamptz
);

create table health.hardware(
    name varchar(255) not null unique,
    heartbeat timestamptz
);