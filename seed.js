import 'dotenv/config';
import db from './src/models/db.js';

const organizations = [
  {
    name: 'BrightFuture Builders',
    description: 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    contact_email: 'info@brightfuturebuilders.org',
    logo_filename: 'brightfuture-logo.png'
  },
  {
    name: 'GreenHarvest Growers',
    description: 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    contact_email: 'contact@greenharvest.org',
    logo_filename: 'greenharvest-logo.png'
  },
  {
    name: 'UnityServe Volunteers',
    description: 'A volunteer coordination group supporting local charities and service initiatives.',
    contact_email: 'hello@unityserve.org',
    logo_filename: 'unityserve-logo.png'
  }
];

const seedOrganizations = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS public.organization (
      organization_id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      contact_email VARCHAR(255) NOT NULL,
      logo_filename VARCHAR(255) NOT NULL
    );
  `);

  for (const org of organizations) {
    const exists = await db.query(
      `SELECT 1 FROM public.organization WHERE name = $1 LIMIT 1;`,
      [org.name]
    );

    if (exists.rows.length === 0) {
      await db.query(
        `INSERT INTO public.organization (name, description, contact_email, logo_filename)
         VALUES ($1, $2, $3, $4);`,
        [org.name, org.description, org.contact_email, org.logo_filename]
      );
    }
  }

  console.log('Organization seed completed.');
};

try {
  await seedOrganizations();
  console.log('Database seed finished successfully.');
} catch (error) {
  console.error('Database seed failed:', error.message);
  process.exit(1);
} finally {
  await db.end();
}
