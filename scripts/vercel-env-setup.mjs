import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const tasks = [
  ['PUBLIC_SUPABASE_URL', 'preview'],
  ['PUBLIC_SUPABASE_URL', 'development'],
  ['PUBLIC_SUPABASE_ANON_KEY', 'production'],
  ['PUBLIC_SUPABASE_ANON_KEY', 'preview'],
  ['PUBLIC_SUPABASE_ANON_KEY', 'development'],
];

for (const [key, environment] of tasks) {
  const value = env[key];
  if (!value) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }

  const result = spawnSync(
    'npx',
    ['vercel', 'env', 'add', key, environment, '--value', value, '--yes', '--force', '--sensitive'],
    { stdio: 'inherit', shell: true, timeout: 60000 },
  );

  if (result.error || result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log(`set ${key} (${environment})`);
}
