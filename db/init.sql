create schema if not exists alia;

create table alia.config (config_name varchar(255), config_value varchar(255));
create table alia.logs (ts timestamp with time zone UTC DEFAULT now(), log_message varchar(255));