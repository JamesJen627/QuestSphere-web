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

  const args = ['vercel', 'env', 'add', key, environment, '--value', value, '--yes', '--force'];
  if (environment === 'development') {
    args.push('--no-sensitive');
  } else {
    args.push('--sensitive');
  }

  console.log(`Adding ${key} (${environment})...`);
  const result = spawnSync('npx', args, { stdio: 'inherit', shell: true, timeout: 120000 });

  if (result.error || result.status !== 0) {
    console.error(`Failed: ${key} (${environment})`);
    process.exit(result.status ?? 1);
  }

  console.log(`Done: ${key} (${environment})`);
}

console.log('All environment variables configured.');
