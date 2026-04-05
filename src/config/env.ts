export const envConfig = () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || '',
});
