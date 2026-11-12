-- database/migrations/0013_add_is_active_to_groups.sql

ALTER TABLE groups
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
