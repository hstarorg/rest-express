module.exports = {
  dbConfig: config = {
    user: 'acctdbo',
    password: '4Acct2Dev',
    server: '10.1.25.28',
    port: 41433,
    database: 'APIPortal',
    pool: {
      max: 50,
      min: 0,
      idleTimeoutMillis: 30 * 1000
    }
  }
};