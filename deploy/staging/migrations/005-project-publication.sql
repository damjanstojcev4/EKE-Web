-- Preserve existing visibility; the admin explicitly saves new drafts as false.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE NOT NULL;
