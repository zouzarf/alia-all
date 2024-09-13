DROP SCHEMA IF EXISTS config CASCADE;

DROP SCHEMA IF EXISTS scheduler CASCADE;

DROP SCHEMA IF EXISTS live CASCADE;

create schema if not exists config;

create schema if not exists scheduler;

create schema if not exists live;

CREATE TABLE config.nodes (node_name varchar(255) not null unique);

create table config.general_config (
    name varchar(255) not null UNIQUE,
    value varchar(255)
);

INSERT INTO
    config.general_config
VALUES
    ('test', 'test');

INSERT INTO
    config.base_station_ports
VALUES
    ('test', 0, 0);

create table config.base_station_ports (
    name varchar(255) not null UNIQUE,
    microprocessor_port int,
    hub_port int
);

create table config.zones (
    name varchar(255) not null unique REFERENCES config.nodes(node_name)
);

create table config.routers (
    name varchar(255) not null unique REFERENCES config.nodes(node_name),
    mac_address varchar(255) unique,
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

create table scheduler.jobs (
    id SERIAL not null unique,
    name varchar(255) unique not null,
    zone_name varchar(255) not null,
    start_date timestamptz not null,
    end_date timestamptz not null
);

create table scheduler.jobs_actions (
    id SERIAL not null unique,
    job_id int,
    hour int,
    water_level int,
    dose_number int,
    dose_amount int,
    mixing_time int,
    routing_time int,
    compressing_time int,
    UNIQUE (job_id, hour)
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
    log_message varchar(255)
);

create table live.events (
    id SERIAL not null unique,
    ts timestamptz DEFAULT now(),
    producer varchar(255),
    log_message varchar(255)
);