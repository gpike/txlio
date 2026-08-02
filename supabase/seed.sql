-- Local development seed for Txlio
-- Password for seeded users: Password123!

insert into auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  aud,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'agent1@txlio.local',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '',
    '',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Agent One"}'::jsonb,
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'tc1@txlio.local',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '',
    '',
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"TC One"}'::jsonb,
    now(),
    now()
  )
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
)
values
  (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    format('{"sub":"%s","email":"%s"}', '11111111-1111-1111-1111-111111111111', 'agent1@txlio.local')::jsonb,
    'email',
    'agent1@txlio.local',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    format('{"sub":"%s","email":"%s"}', '22222222-2222-2222-2222-222222222222', 'tc1@txlio.local')::jsonb,
    'email',
    'tc1@txlio.local',
    now(),
    now()
  )
on conflict (provider_id, provider) do nothing;

insert into public.profiles (id, full_name, role)
values
  ('11111111-1111-1111-1111-111111111111', 'Agent One', 'agent'),
  ('22222222-2222-2222-2222-222222222222', 'TC One', 'coordinator')
on conflict (id) do update
set full_name = excluded.full_name,
    role = excluded.role;

insert into public.timelines (
  id,
  user_id,
  property_address,
  contract_title,
  page_count,
  entries
)
values
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '123 Main St, Denver, CO',
    'Main Street Purchase Contract',
    18,
    '[{"title":"Inspection Deadline","date":"2026-08-12"},{"title":"Financing Deadline","date":"2026-08-21"}]'::jsonb
  )
on conflict (id) do nothing;
