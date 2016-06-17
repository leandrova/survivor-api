'use strict';

var mysql	= require('mysql');
var env 	= require('node-env-file');

env('./.env', { overwrite: true });

class Data {

 private connection;
 private sql;
 private resultado;
 private linhas;
 private ID;
 public sqlList = [];
 public mysqlError;

 constructor() {
  /*var connection = mysql.createConnection({
   connectionLimit : 100,
   host     : process.env.DATA_HOST,
   user     : process.env.DATA_USER,
   password : process.env.DATA_PASS,
   database : process.env.DATA_BASE,
   debug    :  false
  });*/
 }

 destructor() {
  /*connection.destroy();*/
 }

 private function processaSql(){

 	if (connection.threadId) {

 		connection.query({
		  sql: this->sql,
		  timeout: 40000, // 40s 
		  values: ['David']
		}, function (error, results, fields) {
			this.linhas = results.affectedRows;
			console.log('error', error);
			console.log('results', results);
			console.log('fields', fields);
		});

 	}

  /*if ($this->conexao) {
   
   $this->ID=mysql_insert_id();
   $this->linhas=mysql_affected_rows();
   $this->mysqlError=str_replace("'","",mysql_error());
   if ($this->LOGSQL) $this->sqlList[]=$this->sql." => ".$this->linhas." => ".$this->mysqlError;
  }*/
 }

 public function consulta(array) {

  if (array["campos"] != "undefined") {
   campos = array["campos"];
  } else {
   campos = "*";
  }

  /* Definindo os campos da consulta */
  $this->sql = "select " + $campos + " ";
  /* Definindo as tabelas da consulta */
  $this->sql += "from " + array["tabelas"] + " ";

  if (array["condicoes"] != "undefined") {
   $this->sql += "where " + array["condicoes"] + " ";
  }
  if (array["agrupamento"] != "undefined") {
   $this->sql += "group by " + array["agrupamento"] + " ";
  }
  if (array["ordenacao"] != "undefined") {
   $this->sql += "order by " + array["ordenacao"] + " ";
  }
  if (array["limite"] != "undefined") {
   $this->sql += "limit " + array["limite"] + " ";
  }

 }


 public function GetResultado() {
  return $this->resultado;
 }
 
 public function GetSql() {
  return $this->sql;
 }
 
 public function GetID() {
  return $this->ID;
 }
 
 public function GetLinhas() {
  return $this->linhas;
 }
 
 public function GetSqlList() {
  return $this->sqlList;
 }

 public function GetMysqlError() {
  return $this->mysqlError;
 }
 
 public function executaSql($sql) {
  $this->sql=$sql;
  $this->processaSql();
 }

}

module.exports = Data;