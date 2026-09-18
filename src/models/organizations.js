import db from './db.js';

const ensureOrganizationTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.organization (
            organization_id SERIAL PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            contact_email VARCHAR(255) NOT NULL,
            logo_filename VARCHAR(255) NOT NULL
        );
    `;

    await db.query(createTableQuery);

    const seedQuery = `
        INSERT INTO public.organization (name, description, contact_email, logo_filename)
        SELECT v.name, v.description, v.contact_email, v.logo_filename
        FROM (VALUES
            ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
            ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
            ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')
        ) AS v(name, description, contact_email, logo_filename)
        WHERE NOT EXISTS (
            SELECT 1 FROM public.organization
        );
    `;

    await db.query(seedQuery);
};

const getAllOrganizations = async () => {
    try {
        await ensureOrganizationTable();

        const query = `
            SELECT organization_id, name, description, contact_email, logo_filename
            FROM public.organization
            ORDER BY organization_id;
        `;

        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error loading organizations:', error.message);
        return [];
    }
};

export { getAllOrganizations };