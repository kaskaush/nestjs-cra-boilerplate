/**
 * This configuration represents the default test/dev environment configuration.
 * Any property listed here is overwritten by global environment variables or by
 * .env or .env.secret files.
 */
export default () =>
  // only return this default config if we're running as local.
  process.env.ENV === 'local' ? {} : {};
