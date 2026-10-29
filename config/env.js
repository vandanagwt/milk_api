// Central place for secrets/config; override with environment variables in production.
module.exports = {
    JWT_SECRET: process.env.APP_JWT_SECRET || 'change-me-in-production',
    JWT_EXPIRES: process.env.APP_JWT_EXPIRES || '30d',
    FIREBASE_KEY_PATH: process.env.FIREBASE_KEY_PATH || __dirname + '/firebase-service-account.json',
    // Fixed test account that skips Firebase SMS. Off by default when NODE_ENV=production;
    // set TEST_LOGIN_ENABLED=true/false to override.
    TEST_LOGIN_ENABLED: process.env.TEST_LOGIN_ENABLED
        ? process.env.TEST_LOGIN_ENABLED === 'true'
        : process.env.NODE_ENV !== 'production',
    TEST_LOGIN_PHONE: '9999999999',
    TEST_LOGIN_OTP: '1234',
    FREE_DELIVERY_ABOVE: 500,
    DELIVERY_CHARGE: 40
};
