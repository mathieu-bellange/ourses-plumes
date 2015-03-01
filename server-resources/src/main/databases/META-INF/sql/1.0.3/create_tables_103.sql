DROP TABLE IF EXISTS bear_account
DROP TABLE IF EXISTS ourses_authentication_info
DROP TABLE IF EXISTS ourses_authorization_info
DROP TABLE IF EXISTS article_tag
DROP TABLE IF EXISTS article_coauthor
DROP TABLE IF EXISTS article
DROP TABLE IF EXISTS social_link
DROP TABLE IF EXISTS profile
DROP TABLE IF EXISTS tag
DROP TABLE IF EXISTS category
DROP TABLE IF EXISTS rubrique
DROP TABLE IF EXISTS ourse_security_token
DROP TABLE IF EXISTS avatar
DROP TABLE IF EXISTS old_path
DROP TABLE IF EXISTS freq_asked_question
DROP TABLE IF EXISTS calendar_event

create table ourse_security_token (
  id						bigint not null DEFAULT nextval('ourse_security_token_seq'),
  login                     varchar(255)  not null,
  token                     varchar(255) not null,
  expiration_date           timestamp not null,
  constraint pk_ourse_security_token primary key (token))
;

create table bear_account (
  id                        bigint not null DEFAULT nextval('bear_account_seq'),
  authc_info_id             bigint not null,
  version                   int not null,
  authz_info_id             bigint not null,
  profile_id                bigint not null,
  renew_password_date       varchar(255),
  constraint pk_bear_account primary key (id))
;

create table ourses_authentication_info (
  id                        bigint not null DEFAULT nextval('ourses_authentication_info_seq'),
  mail                      varchar(255) not null,
  credentials               varchar(255) not null,
  version                   int not null,
  constraint pk_ourses_authentication_info primary key (id))
;

create table ourses_authorization_info (
  id                        bigint not null DEFAULT nextval('ourses_authorization_info_seq'),
  roles_for_db              varchar(255) not null,
  label                     varchar(255) not null,
  constraint pk_ourses_authorization_info primary key (id))
;

create table profile (
  id                        bigint not null DEFAULT nextval('profile_seq'),
  pseudo                    varchar(255) not null,
  description               varchar(1000),
  path                      varchar(255),
  pseudo_beautify           varchar(255),
  avatar_id                 bigint,
  version                   int not null,
  constraint pk_profile primary key (id))
;

create table avatar (
  id                        bigint not null DEFAULT nextval('avatar_seq'),
  image                     bytea,
  path                      varchar(255),
  constraint pk_profile_img primary key (id))
;

create table social_link (
  id                        bigint not null DEFAULT nextval('social_link_seq'),
  network                   varchar(255) not null,
  social_user               varchar(255) not null,
  profile_id                bigint not null,
  constraint pk_social_link primary key (id))
;

alter table bear_account add constraint fk_bear_account_authcInfo_1 foreign key (authc_info_id) references ourses_authentication_info (id) on delete restrict on update restrict;
create index ix_bear_account_authcInfo_1 on bear_account (authc_info_id);
alter table bear_account add constraint fk_bear_account_authzInfo_2 foreign key (authz_info_id) references ourses_authorization_info (id) on delete restrict on update restrict;
create index ix_bear_account_authzInfo_2 on bear_account (authz_info_id);
alter table bear_account add constraint fk_bear_account_profile_3 foreign key (profile_id) references profile (id) on delete restrict on update restrict;
create index ix_bear_account_profile_3 on bear_account (profile_id);
alter table social_link add constraint fk_social_link_profile foreign key (profile_id) references profile (id) on delete restrict on update restrict;
create index ix_social_link_profile on social_link (profile_id);
alter table profile add constraint fk_profile_avatar_1 foreign key (avatar_id) references avatar (id) on delete restrict on update restrict;
create index ix_profile_avatar_1 on profile (avatar_id);

create table category (
  id                        bigint not null DEFAULT nextval('category_seq'),
  category                  varchar(255) not null,
  constraint pk_category primary key (id))
;

create table rubrique (
  id                        bigint not null DEFAULT nextval('rubrique_seq'),
  rubrique                  varchar(255) not null,
  classe                    varchar(255) not null,
  path                      varchar(255) not null,
  constraint pk_rubrique primary key (id))
;

create table tag (
  id                        bigint not null DEFAULT nextval('tag_seq'),
  tag                       varchar(255) not null unique,
  constraint pk_tag primary key (id))
;

create table article (
  id                        bigint not null DEFAULT nextval('article_seq'),
  title                     varchar(255),
  description               varchar(1000),
  body                      varchar(1000000),
  published_date            TIMESTAMP,
  created_date              date,
  updated_date              date,
  profile_id                bigint not null,
  category_id               bigint,
  rubrique_id               bigint,
  status                    int,
  path                      varchar(255),
  title_beautify            varchar(255),
  constraint pk_article primary key (id))
;

create table article_tag (
  id                        bigint not null DEFAULT nextval('article_tag_seq'),
  article_id                bigint not null,
  tag_id                    bigint not null,
  constraint pk_article_tag primary key (id))
;

create table article_coauthor (
  id                        bigint not null DEFAULT nextval('article_coauthor_seq'),
  article_id                bigint not null,
  profile_id                bigint not null,
  constraint pk_article_coauthor primary key (id))
;
alter table article add constraint fk_article_profile_1 foreign key (profile_id) references profile (id);
create index ix_article_profile_1 on article (profile_id);
alter table article add constraint fk_article_category_2 foreign key (category_id) references category (id);
create index ix_article_category_2 on article (category_id);
alter table article add constraint fk_article_rubrique_3 foreign key (rubrique_id) references rubrique (id);
create index ix_article_rubrique_3 on article (rubrique_id);

alter table article_tag add constraint fk_article_tag_article_1 foreign key (article_id) references article (id);
create index ix_article_tag_article_1 on article_tag (article_id);
alter table article_tag add constraint fk_article_tag_tag_2 foreign key (tag_id) references tag (id);
create index ix_article_tag_tag_2 on article_tag (tag_id);

alter table article_coauthor add constraint fk_article_coauthor_article_1 foreign key (article_id) references article (id);
create index ix_article_coauthor_article_1 on article_coauthor (article_id);
alter table article_coauthor add constraint fk_article_coauthor_profile_2 foreign key (profile_id) references profile (id);
create index ix_article_coauthor_profile_2 on article_coauthor (profile_id);

create table calendar_event (
  id                        bigint not null DEFAULT nextval('calendar_event_seq'),
  event_date                date,
  title                     varchar(255),
  constraint pk_calendar_event primary key (id))
;

create table old_path (
  id                        bigint not null DEFAULT nextval('old_path_seq'),
  path                      varchar(255),
  article_id                bigint not null,
  constraint pk_old_path primary key (id))
;

alter table old_path add constraint fk_article_old_path_article_1 foreign key (article_id) references article (id);
create index ix_article_old_path_article_1 on old_path (article_id);

create table freq_asked_question (
  id                        bigint not null DEFAULT nextval('faq_seq'),
  question                  varchar(2000),
  answer                    varchar(10000),
  question_order            int,
  constraint pk_freq_asked_question primary key (id))
;
