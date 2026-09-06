// Framework-agnostic helpers. Keep these pure (no `cy.*`) so they are easy to
// unit-test and reuse. Import them into specs or page objects as needed.

/**
 * Build a unique-ish string, handy for creating test data that must not collide
 * across parallel runs.
 * @example uniqueName('user') // 'user-lq8f2k-482'
 */
export function uniqueName(prefix = 'test') {
  const stamp = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 1000);
  return `${prefix}-${stamp}-${rand}`;
}

/**
 * Generate a random email on a domain you control.
 */
export function randomEmail(domain = 'example.test') {
  return `${uniqueName('user')}@${domain}`;
}

/**
 * Return today's date (or an offset from it) as an ISO `YYYY-MM-DD` string.
 * @param {number} offsetDays positive = future, negative = past
 */
export function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Deep-freeze an object so shared fixtures cannot be mutated by one test and
 * leak into the next.
 */
export function freeze(obj) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      freeze(value);
    }
  });
  return Object.freeze(obj);
}
