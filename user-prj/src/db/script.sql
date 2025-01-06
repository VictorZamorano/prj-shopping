-- CREATE DATABASE shopping;
CREATE DATABASE myshop_user_admin_data

-- \c shopping;

-- Drop tables
DROP TABLE IF EXISTS "admin_account";
DROP TABLE IF EXISTS "user_account";
DROP TABLE IF EXISTS "user_data";

CREATE TABLE "user_account" (
    "id" serial PRIMARY KEY,
    "user_acc" varchar(20),
    "password" varchar(200),
    "role" varchar(10),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE "user_data" (
    "id" serial PRIMARY KEY,
    "user_account_id" int,
    "name" varchar(20),
    "first_name" varchar(20),
    "second_name" varchar(20),
    "address" varchar(100),
    "region" varchar(40),
    "city" varchar(40),
    "commune" varchar(40),
    "zip_code" varchar(20),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_account_id")
        REFERENCES "user_account" ("id")
        ON DELETE CASCADE
)


