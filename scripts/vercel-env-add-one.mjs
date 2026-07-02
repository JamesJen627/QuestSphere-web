import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [, , key, environment] = process.argv;
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const value = env[key];
if (!value) {
  console.error(`Missing ${key} in .env`);
  process.exit(1);
}

const args = ['vercel', 'env', 'add', key, environment, '--value', value, '--yes', '--force'];
args.push(environment === 'development' ? '--no-sensitive' : '--sensitive');

const result = spawnSync('npx', args, { stdio: 'inherit', shell: true });
process.exit(result.status ?? (result.error ? 1 : 0));
