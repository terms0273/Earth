# --- !Ups

create table accounts (
  id                            bigint auto_increment not null,
  user_name                     varchar(255) not null,
  password                      varchar(255) not null,
  full_name                     varchar(255) not null,
  type                          integer default 1,
  is_delete                     integer default 1,
  constraint uq_accounts_user_name unique (user_name),
  constraint pk_accounts primary key (id)
);

create table weathers (
  id                            bigint auto_increment not null,
  city_id                       integer not null,
  name                          varchar(255) not null,
  visibility                    integer not null,
  lat                           double,
  lon                           double,
  weatherid                     integer,
  main                          varchar(255),
  description                   varchar(255),
  icon                          varchar(255),
  temp                          double,
  pressure                      integer,
  humidity                      integer,
  temp_min                      double,
  temp_max                      double,
  wind_speed                    double,
  wind_deg                      integer,
  cloud_all                     integer,
  dt                            DATETIME,
  country                       varchar(255),
  sunrise                       DATETIME,
  sunset                        DATETIME,
  inserted_at                   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP not null,
  constraint pk_weathers primary key (id)
);


# --- !Downs

drop table if exists accounts;

drop table if exists weathers;

