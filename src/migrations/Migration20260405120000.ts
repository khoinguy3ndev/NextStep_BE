import { Migration } from "@mikro-orm/migrations";

export class Migration20260405120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'alter table "users" alter column "password" type varchar(255) using ("password"::varchar(255));',
    );
    this.addSql('alter table "users" alter column "password" drop not null;');
    this.addSql('alter table "users" add column "avatar" varchar(255) null;');
    this.addSql(
      'alter table "users" add column "google_id" varchar(255) null;',
    );
    this.addSql(
      'alter table "users" add constraint "users_google_id_unique" unique ("google_id");',
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
