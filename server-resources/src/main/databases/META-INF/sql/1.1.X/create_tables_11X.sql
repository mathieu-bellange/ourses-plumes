create table calendar_event (
  id                        bigint GENERATED BY DEFAULT AS SEQUENCE calendar_event_seq  not null,
  event_date                date,
  title                     varchar(255),
  description				varchar(2000),
  constraint pk_calendar_event primary key (id))
;