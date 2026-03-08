import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  // Set admin@test.com as admin
  await sql`UPDATE users SET role = 'ADMIN' WHERE email = ${'admin@test.com'}`;
  console.log('Admin role set for admin@test.com');
}

main().catch(console.error);
