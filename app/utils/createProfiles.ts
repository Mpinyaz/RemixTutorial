import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL!;

if (!dbUrl) {
  throw new Error("Couldn't find the connection string");
}

const sql = postgres(dbUrl);

async function main() {
  try {
    // Create or replace the function to update the timestamp before each update
    await sql`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql';
    `;

    // Create the trigger for updating 'updated_at' on profiles table updates
    await sql`
      CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON "public"."profiles"
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `;

    // Create or replace the function to handle new user creation
    await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (user_id, username, user_email)
        VALUES (NEW.id, NEW.raw_user_meta_data->>'fullname', NEW.email);
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
    `;

    // Create the trigger that fires after a new user is created in the auth.users table
    await sql`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
    `;

    console.log("Functions and triggers created successfully.");
  } catch (error) {
    console.error("Error creating functions or triggers:", error);
  } finally {
    // Close the database connection
    await sql.end();
    process.exit();
  }
}

main();
