create table calendar_event (
  id                        bigint not null DEFAULT nextval('calendar_event_seq'),
  event_date                date,
  title                     varchar(255),
  description						varchar(2000),
  constraint pk_calendar_event primary key (id))
;