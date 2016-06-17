'use strict';

var mysql	= require('mysql');
var env 	= require('node-env-file');

var Base = require('../_components/index.js');

env('./.env', { overwrite: true });

var connection = null;
var sql = null;
var resultado = null;
var linhas = null;
var ID = null;
var sqlList = [];
var mysqlError = null;

class Data extends Base {

 constructor() {
  super();
 }

 conectDataBase() {
  console.log('Constructor Store');
  connection = mysql.createConnection({
   connectionLimit : 100,
   host     : process.env.DATA_HOST,
   user     : process.env.DATA_USER,
   password : process.env.DATA_PASS,
   database : process.env.DATA_BASE,
   debug    : false,
   port     : process.env.DATA_PORT
  });

  connection.connect();

  return connection;
 }

 desconectDataBase(connection) {
  console.log('Destructor Store');
  connection.end();
 }

 processaSql() {

  connection = this.conectDataBase();
  
  connection.query({
	  sql: this.sql,
	  timeout: 40000 // 40s 
	}, function (error, results, fields) {
		// this.linhas = results.affectedRows;
    if (error.code) {
      // result = this.__reason(0, error.code);
    } else {
      // result = this.__reason(1);
    }
    // console.log(result);
    console.log(this);
		// console.log('error', error.code);
		// console.log('results', results);
		// console.log('fields', fields);
	});

  this.desconectDataBase(connection);

 }

 consulta(array) {

  if (array['campos']) {
   var campos = array['campos'];
  } else {
   var campos = '*';
  }

  this.sql = 'select ' + campos + ' ';

  this.sql += 'from ' + array['tabelas'] + ' ';

  if (array['condicoes']) {
   this.sql += 'where ' + array['condicoes'] + ' ';
  }
  if (array['agrupamento']) {
   this.sql += 'group by ' + array['agrupamento'] + ' ';
  }
  if (array['ordenacao']) {
   this.sql += 'order by ' + array['ordenacao'] + ' ';
  }
  if (array['limite']) {
   this.sql += 'limit ' + array['limite'] + ' ';
  }

  this.processaSql()

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