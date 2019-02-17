/**
 *
 * @archive: unit-test.js
 * @author Leandro Viana
 * @description: Arquivo Teste Unitários
 *
**/

/**
 * Carregando as bibliotecas
**/

var chai    = require("chai");
var assert  = chai.assert;

/**
 * Carregando os componentes que serão testados
**/

var Base = require('../source/_components/index.js');
var Func = new Base();

describe('Teste Unitários', () => {

  it("Deve retornar '1000 : Channel invalido'", () => {
    assert.equal(Func.reason(0 ,1000).error, '1000');
  });

  it("Deve retornar data do dia", () => {
    var date = new Date();
    assert.equal(Func.date(), date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate());
  });

});
