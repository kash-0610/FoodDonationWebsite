-- Run this ONCE in Supabase: SQL Editor -> New query -> paste all of this -> Run
-- It adds the columns the new claim feature needs.
-- (this assumes your food_donations table already has an "id" column, the default one)

alter table food_donations add column if not exists status text default 'available';
alter table food_donations add column if not exists claimed_by text;
alter table food_donations add column if not exists claimed_at timestamptz;

-- old rows get "available" too
update food_donations set status = 'available' where status is null;


-- Row Level Security: lets the website (anon key) read, add, claim and remove listings.
-- There is no login in our project, so these are open to everyone.
-- That's okay for a college project but a real app would use Supabase Auth.

alter table food_donations enable row level security;

drop policy if exists "ps read" on food_donations;
drop policy if exists "ps insert" on food_donations;
drop policy if exists "ps update" on food_donations;
drop policy if exists "ps delete" on food_donations;

create policy "ps read" on food_donations for select to anon using (true);
create policy "ps insert" on food_donations for insert to anon with check (true);
create policy "ps update" on food_donations for update to anon using (true) with check (true);
create policy "ps delete" on food_donations for delete to anon using (true);


-- OPTIONAL: the old test listings have wrong category names (the old dropdown was buggy)
-- so the category filter won't match them. Easiest fix is to delete them.
-- Remove the two dashes in front of the next line to run it.
-- delete from food_donations;
