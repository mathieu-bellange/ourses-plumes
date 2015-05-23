create table web_site_statistic (
  page                      varchar(255)  not null,
  count_day                 date not null,
  view_count               	int,
  constraint pk_web_site_statistics primary key (page,count_day))
;