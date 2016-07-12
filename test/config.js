module.exports = {
  dbConfig: config = {
    user: 'xxx',
    password: 'xxx',
    server: '127.0.0.1',
    port: 1433,
    database: 'xxx',
    pool: {
      max: 50,
      min: 0,
      idleTimeoutMillis: 30 * 1000
    }
  }
};