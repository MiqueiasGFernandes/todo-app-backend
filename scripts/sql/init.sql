CREATE TABLE task_lists (
  id uuid not null primary key,
  title varchar(255) not null,
  description text,
  created_at timestamp not null default now(),
  updated_at timestamp
);

CREATE TABLE tasks (
  id uuid not null primary key,
  title varchar(255) not null,
  description text,
  task_list_id uuid not null,
  created_at timestamp not null default now(),
  updated_at timestamp,

  foreign key (task_list_id) references task_lists(id) 
);

insert into task_lists (id, title, description, created_at) values ('40f05b67-e886-40bb-be6d-e0a413be6faa'::UUID, 'Inbox', 'Lista padrão', NOW());