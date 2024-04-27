ALTER TABLE "users" ADD COLUMN "roleName" TEXT NOT NULL DEFAULT 'USER';

CREATE TABLE "roles" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

UPDATE "users" SET "roleName" = 'USER' WHERE "roleName" IS NULL;

ALTER TABLE "users" ADD CONSTRAINT "users_roleName_fkey"
    FOREIGN KEY ("roleName") REFERENCES "roles"("name")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;