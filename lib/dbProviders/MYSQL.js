let mysql;
class MYSQL {
  constructor(config) {
    mysql = require('mysql');
    let poolCluster = this.poolCluster = mysql.createPoolCluster({
      canRetry: true,
      removeNodeErrorCount: 5, // Remove the node immediately when connection fails.
      defaultSelector: 'RR'
    });

    let commonConfig = config.config;

    // Add masters
    config.masters.forEach((master, i) => {
      let masterConfig = Object.assign({}, commonConfig, master);
      poolCluster.add(`MASTER${i + 1}`, masterConfig);
    });

    // Add slaves
    config.slaves.forEach((slave, i) => {
      let slaveConfig = Object.assign({}, commonConfig, slave)
      poolCluster.add(`SLAVE${i + 1}`, slaveConfig);
    });

    this.write = new MysqlInstance(this, true);
    this.read = new MysqlInstance(this, false);
  }

  _getConnection(isMaster = true) {
    let name = isMaster ? 'MASTER*' : 'SLAVE*';
    return new Promise((resolve, reject) => {
      poolCluster.getConnection(name, (err, connection) => {
        if (err) {
          return reject(err);
        }
        resolve(connection);
      });
    });
  }

  executeNonQuery(commandText, params) {
    return this.write.executeNonQuery(commandText, params);
  }

  executeScalar(commandText, params) {
    return this.write.executeScalar(commandText, params);
  }

  executeQuery(commandText, params) {
    return this.write.executeQuery(commandText, params);
  }

  executeProc(commandText, params = [], opt = { nestTables: false }) {
    return this.write.executeProc(commandText, params, opt);
  }

  executeMultiple(commandTextArray) {
    return this.write.executeMultiple(commandTextArray);
  }

  beginTransaction() {
    return this.write.beginTransaction();
  }
}

class MysqlInstance {
  constructor(mysqlIns, isMaster = true) {
    this.mysqlIns = mysqlIns;
    this.isMaster = isMaster;
  }
  _getConnection() {
    return this.mysqlIns._getConnection(this.isMaster);
  }

  _query(commandText, params, options) {
    return this._getConnection()
      .then(conn => {
        let sql = mysql.format(commandText, params);
        return new Promise((resolve, reject) => {
          conn.query(sql, (err, results, fields) => {
            if (err) return reject(err);
            resolve({
              results,
              fields
            });
          });
        });
      });
  }

  executeNonQuery(commandText, ...params) {
    return this._query(commandText, params)
      .then(r => {
        return Promise.resolve(r.results);
      });
  }

  executeScalar(commandText, params) {
    return this._query(commandText, params)
      .then(r => {
        let result = null;
        if (r.results.length > 0) {
          result = r.results[0];
        }
        return Promise.resolve(result);
      });
  }

  executeQuery(commandText, params) {
    return this._query(commandText, params)
      .then(r => {
        return Promise.resolve(r.results);
      });
  }

  executeProc(commandText, params = [], opt = { nestTables: false }) {
    let sql = mysql.format(commandText, params);
    let options = Object.assign({}, opt, { sql });
    return this._getConnection()
      .then(conn => {
        return new Promise((resolve, reject) => {
          conn.query(options, (err, results, fields) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        });
      });
  }

  executeMultiple(commandTextArray) {
    let formatedCommondTextArray = commandTextArray.map(cmd => {
      return mysql.format(cmd, []);
    });
    let multipleSql = formatedCommondTextArray.join(';') + ';';
    return this._getConnection()
      .then(conn => {
        let multipleSupportConfig = Object.assign({}, conn.config, { multipleStatements: true });
        let multipleSupportConn = mysql.createConnection(multipleSupportConfig);
        return new Promise((resolve, reject) => {
          multipleSupportConn.query(multipleSql, (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        });
      });
  }

  beginTransaction() {
    return this._getConnection()
      .then(conn => {
        return new Promise((resolve, reject) => {
          conn.beginTransaction(err => {
            if (err) {
              return reject(err);
            }
            return conn;
          });
        });
      });
  }
}

module.exports = MYSQL;