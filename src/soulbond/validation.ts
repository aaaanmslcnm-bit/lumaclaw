const SOUL_BOND_DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SOUL_BOND_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;

export function isValidSoulBondDateKey(value: string): boolean {
  if (!SOUL_BOND_DATE_KEY_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isValidSoulBondTimestamp(value: string): boolean {
  if (!SOUL_BOND_TIMESTAMP_PATTERN.test(value)) {
    return false;
  }

  return Number.isFinite(new Date(value).getTime());
}
