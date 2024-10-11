import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL!;
console.log(dbUrl);
if (!dbUrl) {
  throw new Error("Couldnt find connect string");
}
const sql = postgres(dbUrl);

async function main() {
  await sql`CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';`;
  await sql`CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON "public"."profiles"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();`;

  await sql`
        create or replace function public.handle_new_user()
        returns trigger as $$
        begin
            insert into public.profiles (user_id,username,user_email)
            values (new.id,new.raw_user_meta_data->>'fullname',new.email);
            return new;
        end;
        $$ language plpgsql security definer;`;
  await sql`
        create or replace trigger on_auth_user_created
            after insert on auth.users
            for each row execute procedure public.handle_new_user();
`;
  process.exit();
}

main();
