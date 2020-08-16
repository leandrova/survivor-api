'use strict';

var mysql	= require('mysql');

var Base = require('../_components/index.js');
var Func = new Base();

global.sql = null;

var connection = null;

class Data {

  constructor(){

  }

 processaSql(sql, callback) {

  var connection = mysql.createConnection({
    connectionLimit : 100,
    host     : process.env.DATA_HOST,
    user     : process.env.DATA_USER,
    password : process.env.DATA_PASS,
    database : process.env.DATA_BASE,
    debug    : false,
    port     : process.env.DATA_PORT
  });
 
  connection.connect();

  connection.query({
      sql: sql,
      timeout: 40000 // 40s 
  }, function (error, results, fields) {
    var reason, lines = '';
    /* */
    if (error) {
      reason = Func.reason(0, error.code);
    } else {
      reason = Func.reason(1);
      lines = results.length;
    }
    connection.end();
    /* */
    callback({
      error: error, 
      results: results, 
      lines: lines, 
      reason: reason 
    });

  });

 }

 consulta(array) {
  var sql = 'select ' + (array['campos'] ? array['campos'] : '*') + ' from ' + array['tabelas'];
      sql += (array['condicoes'] ? ' where ' + array['condicoes'] : '');
      sql += (array['agrupamento'] ? ' group by ' + array['agrupamento'] : '');
      sql += (array['ordenacao'] ? ' order by ' + array['ordenacao'] : '');
      sql += (array['limite'] ? ' limit ' + array['limite'] : '');
  return sql;
 }

 cadastro(array) {
  sql  = 'INSERT INTO ' + array['tabelas'] + ' ';
  sql += '(' + array['campos'] + ') ';
  sql += 'VALUES (' + array['values'] + ') ';
  return sql;
 }

 altera(array) {
    sql  = 'UPDATE ' + array['tabelas'] + ' ';
    sql += 'SET ' + array['campos'] + ' ';
    sql += 'WHERE ' + array['condicoes'] + ' ';
    return sql;
  }

 deleta(array) {
    sql  = 'delete from ' + array['tabelas'] + ' ';
    sql += 'where ' + array['condicoes'] + ' ';
    return sql;
  }

 GetResultado() {
  return this.resultado;
 }
 
 GetSql() {
  return this.sql;
 }
 
 GetID() {
  return this.ID;
 }
 
 GetLinhas() {
  return this.linhas;
 }
 
 GetSqlList() {
  return this.sqlList;
 }

 GetMysqlError() {
  return this.mysqlError;
 }
 
 executaSql(sql) {
  this.sql = sql;
  this.processaSql();
 }

}

module.exports = Data;
