// Script de restauración de simpatizantes en tabla supporters de Supabase
// Fuente: contactos_rows.csv

const SUPABASE_URL = 'https://uvsvyelbhjhenufndbcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2c3Z5ZWxiaGpoZW51Zm5kYmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODY0OTYsImV4cCI6MjA5MjM2MjQ5Nn0.xwrQbQZ9rtnJwszQtcYXaAebn0CIm_V29_FiwFoWw-s';

const supporters = [
  { id: '12297ca9-8e8c-469e-8944-cee8b82091ab', email: 'maria333jesus@gmail.com',          name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.478087+00:00' },
  { id: '17904ad6-e7de-4f58-b265-d30f631f57de', email: 'knovoa6@gmail.com',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.832713+00:00' },
  { id: '198b963e-cde5-4952-bf26-ae176d60c82a', email: 'masanchez859@gmail.com',           name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.2396+00:00'   },
  { id: '1b268358-d592-4734-9bda-933a4b0471ee', email: 'lcuervoa@yahoo.es',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.670905+00:00' },
  { id: '239b2b63-3935-4904-b92b-d352d24a6888', email: 'jesuseme@gmail.com',               name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.362174+00:00' },
  { id: '2583f442-9587-4a96-a03d-1ebec65d45c0', email: 'mihuca@gmail.com',                 name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:48.339623+00:00' },
  { id: '259e1566-8d5e-442c-b964-2303b5aec5a2', email: 'gloria.grande@hotmail.com',        name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.303464+00:00' },
  { id: '2a071098-7dbb-4920-a269-54474b68b13d', email: 'guillermopescador@gmail.com',      name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.372691+00:00' },
  { id: '3a88f920-3e24-4d54-a662-80c25dfc597e', email: 'crodrigueziglesias@gmail.com',    name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.420148+00:00' },
  { id: '43079526-5d98-4683-9715-ddf70bca6840', email: 'easensiogalvin@gmail.com',         name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:48.21597+00:00'  },
  { id: '440394ac-3ee9-4d66-816f-95a6b43d5dcd', email: 'martingarcia.carmen1999@gmail.com',name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:45.980934+00:00' },
  { id: '443a420b-70c4-4011-af48-493b442d12c1', email: 'mnsol@outlook.com',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.4341+00:00'   },
  { id: '4ef21a23-1375-4241-9ad6-d165ecffb2d5', email: 'alitocha@telefonica.net',          name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.49283+00:00'  },
  { id: '5d518e02-4d78-4d04-b747-408c67eb9339', email: 'jmigpm@gmail.com',                 name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.789833+00:00' },
  { id: '62b4dd06-819a-4153-a304-3a2abe9f097d', email: 'ccregof@gmail.com',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.296824+00:00' },
  { id: '6e74c3fc-8142-40c5-b6ed-dae06b88c856', email: 'mariajesustorre10@gmail.com',      name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.685571+00:00' },
  { id: '726184c1-24a0-4347-97dd-c1630c4cad4f', email: 'pilarporteroasenjo@gmail.com',     name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.083593+00:00' },
  { id: '78de6fb7-7e8e-4972-956b-b1cd9c182d72', email: 'lsanzbenayas@gmail.com',           name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.740817+00:00' },
  { id: '7c97717b-bede-49b9-8b12-a047a29d1a2c', email: 'joseluisrubi@movistar.es',         name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:48.281241+00:00' },
  { id: '89a4c75d-83d8-4381-9206-844cdda7c173', email: 'mesukki@gmail.com',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:45.664969+00:00' },
  { id: '8a24d82a-79aa-4a71-b5b1-a22d8f0773dc', email: 'gazcaratep@gmail.com',             name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.729301+00:00' },
  { id: '8e4402dd-3056-43a4-80eb-09bc6fc02409', email: 'martinsancho.javier@gmail.com',    name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.10495+00:00'  },
  { id: '905e3aed-92b0-43b7-b856-6f5ec523c1e7', email: 'asgaona@gmail.com',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.906334+00:00' },
  { id: '90a1af25-b003-4ea3-a998-d28430b8e4a6', email: 'juantxosa@yahoo.es',               name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.846661+00:00' },
  { id: '992372b7-4718-4c54-8548-b1e4475c54a0', email: 'sabuacas@hotmail.com',             name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.023594+00:00' },
  { id: 'a9617b89-7501-4f80-9129-f2d56db8824e', email: 'eileen.m.gardner@hotmail.com',     name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.545828+00:00' },
  { id: 'a964b587-952e-46b8-b95f-47d49009833c', email: 'olga.lorenzo.gilsanz@hotmail.es',  name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.621023+00:00' },
  { id: 'ae9b63ac-21ab-438e-9165-f0423d27e229', email: 'job112@hotmail.es',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.963444+00:00' },
  { id: 'b08926b3-f330-4dd1-ae32-05990c5be022', email: 'cbaesao@gmail.com',                name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:48.152882+00:00' },
  { id: 'b8289dca-bcb1-490d-aa6b-531a4e042ef6', email: 'mgarellycompte@gmail.com',         name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.039405+00:00' },
  { id: 'c93bc8ef-f5f4-4137-9eb6-050c6ad0df46', email: 'memesanca@gmail.com',              name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.610693+00:00' },
  { id: 'ced7f9a6-c63a-4f34-a34a-a8bdb1f858e2', email: 'aparramar@hotmail.com',            name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.176599+00:00' },
  { id: 'ec39c84c-1ba1-4e73-b46a-535ab3f4e472', email: 'chasensio@hotmail.com',            name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:45.904409+00:00' },
  { id: 'ec99a59e-8659-4b62-898a-aecf503f4e45', email: 'aliesetin@gmail.com',              name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:48.025284+00:00' },
  { id: 'f14fbfff-e3a4-4c0d-9719-7e33eb7df8af', email: 'mariacruzoroz@hotmail.com',        name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:48.089636+00:00' },
  { id: 'f6d1f532-a6e0-4422-9c9b-18300afff794', email: 'javierceron.abg@gmail.com',        name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:47.149898+00:00' },
  { id: 'f9d85beb-ff5b-40a8-b019-64ae665ad24b', email: 'solbermejo@gmail.com',             name: '', source: 'importado', consent: false, created_at: '2026-05-01T11:55:46.555876+00:00' },
];

async function restoreSuporters() {
  console.log(`📦 Insertando ${supporters.length} simpatizantes en tabla supporters...`);

  const response = await fetch(`${SUPABASE_URL}/rest/v1/supporters`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=ignore-duplicates,return=minimal'
    },
    body: JSON.stringify(supporters)
  });

  if (response.ok) {
    console.log(`✅ Éxito: ${supporters.length} registros procesados (los duplicados se ignoraron)`);
    // Verificar cuántos hay ahora en la tabla
    const countResp = await fetch(`${SUPABASE_URL}/rest/v1/supporters?select=id`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'count=exact'
      }
    });
    const countHeader = countResp.headers.get('content-range');
    console.log(`📊 Total en tabla supporters ahora: ${countHeader || '(ver en Supabase)'}`);
  } else {
    const errorText = await response.text();
    console.error(`❌ Error HTTP ${response.status}:`, errorText);
    process.exit(1);
  }
}

restoreSuporters().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
