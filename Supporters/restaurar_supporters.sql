-- ============================================================
-- RESTAURAR SIMPATIZANTES EN TABLA supporters (IAparaseniors)
-- Fuente: contactos_rows.csv — exportado de tabla contactos
-- Fecha restauración: 2026-06-01
-- Campos mapeados: id, email, created_at
-- Campos por defecto: name='' (sin dato), consent=false, source='importado'
-- ============================================================

-- Insertar sólo si el email no existe ya (ON CONFLICT DO NOTHING)
INSERT INTO supporters (id, email, name, source, consent, created_at)
VALUES
  ('12297ca9-8e8c-469e-8944-cee8b82091ab', 'maria333jesus@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.478087+00'),
  ('17904ad6-e7de-4f58-b265-d30f631f57de', 'knovoa6@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.832713+00'),
  ('198b963e-cde5-4952-bf26-ae176d60c82a', 'masanchez859@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.2396+00'),
  ('1b268358-d592-4734-9bda-933a4b0471ee', 'lcuervoa@yahoo.es', '', 'importado', false, '2026-05-01 11:55:47.670905+00'),
  ('239b2b63-3935-4904-b92b-d352d24a6888', 'jesuseme@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.362174+00'),
  ('2583f442-9587-4a96-a03d-1ebec65d45c0', 'mihuca@gmail.com', '', 'importado', false, '2026-05-01 11:55:48.339623+00'),
  ('259e1566-8d5e-442c-b964-2303b5aec5a2', 'gloria.grande@hotmail.com', '', 'importado', false, '2026-05-01 11:55:46.303464+00'),
  ('2a071098-7dbb-4920-a269-54474b68b13d', 'guillermopescador@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.372691+00'),
  ('3a88f920-3e24-4d54-a662-80c25dfc597e', 'crodrigueziglesias@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.420148+00'),
  ('43079526-5d98-4683-9715-ddf70bca6840', 'easensiogalvin@gmail.com', '', 'importado', false, '2026-05-01 11:55:48.21597+00'),
  ('440394ac-3ee9-4d66-816f-95a6b43d5dcd', 'martingarcia.carmen1999@gmail.com', '', 'importado', false, '2026-05-01 11:55:45.980934+00'),
  ('443a420b-70c4-4011-af48-493b442d12c1', 'mnsol@outlook.com', '', 'importado', false, '2026-05-01 11:55:46.4341+00'),
  ('4ef21a23-1375-4241-9ad6-d165ecffb2d5', 'alitocha@telefonica.net', '', 'importado', false, '2026-05-01 11:55:46.49283+00'),
  ('5d518e02-4d78-4d04-b747-408c67eb9339', 'jmigpm@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.789833+00'),
  ('62b4dd06-819a-4153-a304-3a2abe9f097d', 'ccregof@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.296824+00'),
  ('6e74c3fc-8142-40c5-b6ed-dae06b88c856', 'mariajesustorre10@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.685571+00'),
  ('726184c1-24a0-4347-97dd-c1630c4cad4f', 'pilarporteroasenjo@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.083593+00'),
  ('78de6fb7-7e8e-4972-956b-b1cd9c182d72', 'lsanzbenayas@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.740817+00'),
  ('7c97717b-bede-49b9-8b12-a047a29d1a2c', 'joseluisrubi@movistar.es', '', 'importado', false, '2026-05-01 11:55:48.281241+00'),
  ('89a4c75d-83d8-4381-9206-844cdda7c173', 'mesukki@gmail.com', '', 'importado', false, '2026-05-01 11:55:45.664969+00'),
  ('8a24d82a-79aa-4a71-b5b1-a22d8f0773dc', 'gazcaratep@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.729301+00'),
  ('8e4402dd-3056-43a4-80eb-09bc6fc02409', 'martinsancho.javier@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.10495+00'),
  ('905e3aed-92b0-43b7-b856-6f5ec523c1e7', 'asgaona@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.906334+00'),
  ('90a1af25-b003-4ea3-a998-d28430b8e4a6', 'juantxosa@yahoo.es', '', 'importado', false, '2026-05-01 11:55:47.846661+00'),
  ('992372b7-4718-4c54-8548-b1e4475c54a0', 'sabuacas@hotmail.com', '', 'importado', false, '2026-05-01 11:55:47.023594+00'),
  ('a9617b89-7501-4f80-9129-f2d56db8824e', 'eileen.m.gardner@hotmail.com', '', 'importado', false, '2026-05-01 11:55:47.545828+00'),
  ('a964b587-952e-46b8-b95f-47d49009833c', 'olga.lorenzo.gilsanz@hotmail.es', '', 'importado', false, '2026-05-01 11:55:46.621023+00'),
  ('ae9b63ac-21ab-438e-9165-f0423d27e229', 'job112@hotmail.es', '', 'importado', false, '2026-05-01 11:55:47.963444+00'),
  ('b08926b3-f330-4dd1-ae32-05990c5be022', 'cbaesao@gmail.com', '', 'importado', false, '2026-05-01 11:55:48.152882+00'),
  ('b8289dca-bcb1-490d-aa6b-531a4e042ef6', 'mgarellycompte@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.039405+00'),
  ('c93bc8ef-f5f4-4137-9eb6-050c6ad0df46', 'memesanca@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.610693+00'),
  ('ced7f9a6-c63a-4f34-a34a-a8bdb1f858e2', 'aparramar@hotmail.com', '', 'importado', false, '2026-05-01 11:55:46.176599+00'),
  ('ec39c84c-1ba1-4e73-b46a-535ab3f4e472', 'chasensio@hotmail.com', '', 'importado', false, '2026-05-01 11:55:45.904409+00'),
  ('ec99a59e-8659-4b62-898a-aecf503f4e45', 'aliesetin@gmail.com', '', 'importado', false, '2026-05-01 11:55:48.025284+00'),
  ('f14fbfff-e3a4-4c0d-9719-7e33eb7df8af', 'mariacruzoroz@hotmail.com', '', 'importado', false, '2026-05-01 11:55:48.089636+00'),
  ('f6d1f532-a6e0-4422-9c9b-18300afff794', 'javierceron.abg@gmail.com', '', 'importado', false, '2026-05-01 11:55:47.149898+00'),
  ('f9d85beb-ff5b-40a8-b019-64ae665ad24b', 'solbermejo@gmail.com', '', 'importado', false, '2026-05-01 11:55:46.555876+00')
ON CONFLICT (email) DO NOTHING;

-- Verificar resultado:
-- SELECT COUNT(*) FROM supporters;
-- Total esperado: 37 filas
