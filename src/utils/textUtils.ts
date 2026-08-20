/**
 * 解析并切分描述文本为分段列表
 * 支持真正的换行符 (\n, \r\n)、字面量转义换行符 (\n, \\n) 以及用户提到的斜杠换行符 (/n, \/n)、HTML <br> 标签。
 */
export const parseDescriptionSegments = (descriptionText?: string | null): string[] => {
  if (!descriptionText) return [];

  const normalized = descriptionText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\/n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  return normalized
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

/**
 * 按开始时间和结束时间进行降序排序（最近的工作经历排在前面）
 * 在职/Present 优先置顶，其次按结束时间降序，最后按开始时间降序。
 */
export function sortExperiences<T = any>(items: T[]): T[] {
  if (!items || !Array.isArray(items)) return [];

  const isPresent = (val?: string) => {
    if (!val) return false;
    const lower = val.trim().toLowerCase();
    return lower === 'present' || lower.includes('至今') || lower.includes('目前') || lower.includes('now');
  };

  const parseDateNum = (val?: string) => {
    if (!val || isPresent(val)) return 999999;
    const digits = val.replace(/[^\d]/g, '');
    if (!digits) return 0;
    if (digits.length === 4) return parseInt(digits + '00', 10);
    return parseInt(digits.slice(0, 6), 10);
  };

  return [...items].sort((itemA, itemB) => {
    const a = itemA as any;
    const b = itemB as any;
    const endA = a.endDate || a.end_date || '';
    const endB = b.endDate || b.end_date || '';
    const startA = a.startDate || a.start_date || '';
    const startB = b.startDate || b.start_date || '';

    const isPresentA = isPresent(endA);
    const isPresentB = isPresent(endB);

    if (isPresentA && !isPresentB) return -1;
    if (!isPresentA && isPresentB) return 1;

    const dateEndA = parseDateNum(endA);
    const dateEndB = parseDateNum(endB);
    if (dateEndA !== dateEndB) {
      return dateEndB - dateEndA;
    }

    const dateStartA = parseDateNum(startA);
    const dateStartB = parseDateNum(startB);
    return dateStartB - dateStartA;
  });
};
