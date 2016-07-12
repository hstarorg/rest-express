'use strict';
let sql = require('mssql');

class MSSQL {
  constructor(config) {
    this.config = config;
    this.connection = new sql.Connection(this.config);
  }

  _buildRequestParams(request, params) {
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key, value) => {
        if (value.type && value.value) {
          request.input(key, value.type, value.value);
        } else {
          request.input(key, value);
        }
      });
    }
  }

  _getOpenedConnection(callback) {
    if (this.connection.connected) {
      return callback(null);
    }
    this.connection.connect((err) => {
      callback(err);
    });
  }

  _executeQuery(type, commandText, params) {
    let request = new sql.Request(this.connection);
    this._buildRequestParams(request, params);
    return new Promise((resolve, reject) => {
      this._getOpenedConnection((err) => {
        if (err) {
          return reject(err);
        }
        request.query(commandText, (err2, recordset, returnValue) => {
          if (err2) {
            return reject(err2);
          }
          let result;
          switch (type) {
            case 'nonQuery':
              result = returnValue;
              break;
            case 'scalar':
              result = recordset[0];
              if (typeof result === 'object' && result['']) {
                result = result[''];
              }
              break;
            case 'query':
              result = recordset;
              break;
          }
          resolve(result);
        });
      });
    });
  }

  getConnection() {
    return this.connection;
  }

  executeNonQuery(commandText, params) {
    return this._executeQuery('nonQuery', commandText, params);
  }

  executeScalar(commandText, params) {
    return this._executeQuery('scalar', commandText, params);
  }

  executeQuery(commandText, params) {
    return this._executeQuery('query', commandText, params);
  }
}

module.exports = MSSQL;