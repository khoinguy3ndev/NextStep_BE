import { Migration } from '@mikro-orm/migrations';

export class Migration20260220153707 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "users" ("user_id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'users_email_unique') then alter table "users" add constraint "users_email_unique" unique ("email"); end if; end $$;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
