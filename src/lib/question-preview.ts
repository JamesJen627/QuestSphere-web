import type { PublicPackQuestion } from '../types/public-pack';

const OPTION_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export type QuestionKind = 'single' | 'multiple' | 'judge' | 'other';

export function parseOptions(optionsJson?: string): string[] {
  if (!optionsJson?.trim()) return [];

  try {
    const parsed = JSON.parse(optionsJson) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    return optionsJson
      .split(/[,，|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function getQuestionKind(type?: string): QuestionKind {
  const normalized = (type ?? '').toLowerCase();
  if (normalized.includes('多选') || normalized.includes('multiple')) return 'multiple';
  if (normalized.includes('判断') || normalized.includes('judge')) return 'judge';
  if (normalized.includes('单选') || normalized.includes('single')) return 'single';
  return 'other';
}

export function getQuestionTypeLabel(type?: string): string {
  const kind = getQuestionKind(type);
  switch (kind) {
    case 'multiple':
      return '多选题';
    case 'judge':
      return '判断题';
    case 'single':
      return '单选题';
    default:
      return type?.trim() || '题目';
  }
}

export function getOptionMarker(index: number, kind: QuestionKind): string {
  if (kind === 'judge') return index === 0 ? '✓' : '✗';
  return OPTION_LABELS[index] ?? String(index + 1);
}

export function getPackTypeLabel(tags?: string[]): string {
  const normalized = (tags ?? []).map((tag) => tag.toLowerCase());

  if (normalized.some((tag) => tag === 'paid' || tag.includes('付费'))) {
    return '付费公开包';
  }
  if (
    normalized.some((tag) =>
      ['featured', 'demo', '入门', '体验', '示例', '导览'].some((key) => tag.includes(key)),
    )
  ) {
    return '官方体验包';
  }
  if (normalized.some((tag) => tag === 'free' || tag.includes('免费') || tag.includes('官方'))) {
    return '官方免费包';
  }
  return '公开包';
}

export function hasPreviewContent(question: PublicPackQuestion): boolean {
  return Boolean(
    question.question?.trim() ||
      parseOptions(question.optionsJson).length > 0 ||
      question.explanation?.trim(),
  );
}
