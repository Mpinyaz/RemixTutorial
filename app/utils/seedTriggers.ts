import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL!;
console.log(dbUrl);

if (!dbUrl) {
  throw new Error("Couldn't find connection string");
}

const sql = postgres(dbUrl);

async function main() {
  try {
    await sql`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language plpgsql;
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
    `;

    await sql`
      CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `;

    await sql`
      create or replace function public.handle_new_user()
      returns trigger as $$
      begin
        if new.raw_app_meta_data->>'provider' = 'google' then
          insert into public.profiles (
            user_id,
            username,
            user_email,
            avatar_url
          )
          values (
            new.id,
            new.raw_user_meta_data->>'name',
            new.email,
            new.raw_user_meta_data->>'avatar_url'
          );
        else
          insert into public.profiles (
            user_id,
            username,
            user_email
          )
          values (
            new.id,
            new.raw_user_meta_data->>'fullname',
            new.email
          );
        end if;
        return new;
      end;
      $$ language plpgsql security definer;
    `;

    await sql`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `;

    await sql`
      create trigger on_auth_user_created
      after insert on auth.users
      for each row
      execute function public.handle_new_user();
    `;

    console.log("Successfully created all functions and triggers");
  } catch (error) {
    console.error("Error creating functions and triggers:", error);
  } finally {
    await sql.end();
    process.exit();
  }
}

main();
