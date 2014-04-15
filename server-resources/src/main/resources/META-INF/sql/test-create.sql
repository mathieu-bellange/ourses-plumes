DROP TABLE IF EXISTS bear_account
DROP TABLE IF EXISTS ourses_authentication_info
DROP TABLE IF EXISTS ourses_authorization_info
DROP TABLE IF EXISTS article_tag
DROP TABLE IF EXISTS article
DROP TABLE IF EXISTS profile
DROP TABLE IF EXISTS tag
DROP TABLE IF EXISTS category
DROP TABLE IF EXISTS OURSE_AUTHC_TOKEN

create table OURSE_AUTHC_TOKEN (
  login                     varchar(255)  not null,
  token             		varchar(255) not null,
  expiration_date					timestamp not null,
  constraint pk_OURSE_AUTHC_TOKEN primary key (login))
;

create table bear_account (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  authc_info_id             bigint not null,
  version					int not null,
  authz_info_id             bigint not null,
  profile_id                bigint not null,
  constraint pk_bear_account primary key (id))
;

create table ourses_authentication_info (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  mail                      varchar(255),
  credentials               varchar(255),
  version					int not null,
  constraint pk_ourses_authentication_info primary key (id))
;

create table ourses_authorization_info (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  roles_for_db              varchar(255),
  constraint pk_ourses_authorization_info primary key (id))
;

create table profile (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  pseudo                    varchar(255),
  description               varchar(255),
  version					int not null,
  constraint pk_profile primary key (id))
;

alter table bear_account add constraint fk_bear_account_authcInfo_1 foreign key (authc_info_id) references ourses_authentication_info (id) on delete restrict on update restrict;
create index ix_bear_account_authcInfo_1 on bear_account (authc_info_id);
alter table bear_account add constraint fk_bear_account_authzInfo_2 foreign key (authz_info_id) references ourses_authorization_info (id) on delete restrict on update restrict;
create index ix_bear_account_authzInfo_2 on bear_account (authz_info_id);
alter table bear_account add constraint fk_bear_account_profile_3 foreign key (profile_id) references profile (id) on delete restrict on update restrict;
create index ix_bear_account_profile_3 on bear_account (profile_id);

create table category (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  category                    varchar(255),
  constraint pk_category primary key (id))
;

create table tag (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  tag                    varchar(255),
  constraint pk_tag primary key (id))
;

create table article (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  title                   varchar(255),
  publishedDate           DATE,
  profile_id                bigint not null,
  category_id                bigint not null,
  constraint pk_article primary key (id))
;

create table article_tag (
  id                        bigint GENERATED BY DEFAULT AS IDENTITY (START WITH 1)  not null,
  article_id                bigint not null,
  tag_id                bigint not null,
  constraint pk_article_tag primary key (id))
;
alter table article add constraint fk_article_profile_1 foreign key (profile_id) references profile (id);
create index ix_article_profile_1 on article (profile_id);
alter table article add constraint fk_article_category_2 foreign key (category_id) references category (id);
create index ix_article_category_2 on article (category_id);
alter table article_tag add constraint fk_article_tag_article_1 foreign key (article_id) references article (id);
create index ix_article_tag_article_1 on article_tag (article_id);
alter table article_tag add constraint fk_article_tag_tag_2 foreign key (tag_id) references tag (id);
create index ix_article_tag_tag_2 on article_tag (tag_id);


