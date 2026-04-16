import { Migration } from "@mikro-orm/migrations";

export class Migration20260405120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql('alter table "users" alter column "password" type varchar(255) using ("password"::varchar(255));');
    this.addSql('alter table "users" alter column "password" drop not null;');
    this.addSql('alter table "users" add column if not exists "avatar" varchar(255) null;');
    this.addSql('alter table "users" add column if not exists "google_id" varchar(255) null;');
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'users_google_id_unique') then alter table "users" add constraint "users_google_id_unique" unique ("google_id"); end if; end $$;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      'alter table "users" drop constraint "users_google_id_unique";',
    );
    this.addSql('alter table "users" drop column "google_id";');
    this.addSql('alter table "users" drop column "avatar";');
    this.addSql('alter table "users" alter column "password" set not null;');
  }
}
