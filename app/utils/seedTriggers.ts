import postgres from "postgres";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}

const sql = postgres(dbUrl);

async function main() {
  await sql`
        create or replace function public.handle_new_user()
        returns trigger as $$
        begin
            insert into public.profiles (id,fullname,userEmail)
            values (new.id,new.raw_user_meta_data ->> 'full_name',new.email);
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
