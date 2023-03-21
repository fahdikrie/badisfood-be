export function exclude<T, Key extends keyof T>(
  query: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete query[key];
  }
  return query;
}
