import type { PublicPackRow } from '../types/public-pack';

const MAX_DESCRIPTION_LENGTH = 200;

export function buildPackShareMeta(pack: PublicPackRow): { title: string; description: string } {
  const metaParts: string[] = [];
  if (pack.question_count != null) metaParts.push(`${pack.question_count} 题`);
  if (pack.author_nickname) metaParts.push(`作者 ${pack.author_nickname}`);
  if (pack.version != null) metaParts.push(`v${pack.version}`);

  const description =
    pack.description?.trim() ||
    (metaParts.length > 0
      ? `${metaParts.join(' · ')} — 在题域 App 中订阅此公开包`
      : '在题域 App 中订阅此公开包');

  return {
    title: `${pack.title} — 题域预览`,
    description: description.slice(0, MAX_DESCRIPTION_LENGTH),
  };
}
