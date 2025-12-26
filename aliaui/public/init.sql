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
    ('SCHEDULER', 'false');

create table config.base_station_ports (
    name varchar(255) not null UNIQUE,
    hub_port int,
    relay_channel int,
    hub_serial_number int
);

INSERT INTO
    config.base_station_ports
VALUES
    ('PUMP_1', 0, 0, 671787),
    ('PUMP_2', 0, 1, 671787),
    ('PUMP_3', 0, 2, 671787),
    ('PUMP_4', 0, 3, 671787),
    ('VALVE_1', 1, 0, 671787),
    ('VALVE_2', 1, 1, 671787),
    ('VALVE_3', 1, 2, 671787),
    ('VALVE_4', 1, 3, 671787),
    ('COMPRESSOR', 2, 0, 671787);

create table config.zones (
    name varchar(255) not null unique REFERENCES config.nodes(node_name)
);

create table config.routers (
    name varchar(255) not null unique REFERENCES config.nodes(node_name),
    hub_serial_number int unique,
    hub_port int,
    relay_channel int,
    linked_to_base_station boolean
);

create table config.routes (
    id SERIAL not null unique,
    src varchar(255),
    dst varchar(255),
    hub_port int,
    relay_channel int,
    hub_serial_number int,
    UNIQUE (src, dst)
);

create table scheduler.irrigation (
    id SERIAL not null unique,
    schedule_name varchar(255) not null,
    zone_name varchar(255) not null,
    date timestamptz not null,
    water_pump int,
    routing_time float,
    compressing_time float,
    warmup_pump float,
    warmup_compressor float,
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

create table config.wireless_hubs (
    id SERIAL not null unique,
    ip varchar(255) not null unique
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