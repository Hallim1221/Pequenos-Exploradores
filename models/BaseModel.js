/**
 * BaseModel - Classe base padronizada para todos os models
 * Implementa padrão único: try/catch com mockdb fallback
 * Reduz duplicação e garante consistência
 */

const pool = require('../config/database');
const mockdb = require('../lib/mockdb');

class BaseModel {
  // Flag para controlar fallback mockdb
  static useMock = false;

  /**
   * Executa query com fallback para mockdb
   * @param {Function} queryFn - Função que executa a query
   * @param {Function} mockFn - Função que executa no mockdb
   * @returns {Promise}
   */
  static async executeWithFallback(queryFn, mockFn) {
    try {
      if (this.useMock) throw new Error('Using mock database');
      return await queryFn();
    } catch (erro) {
      console.warn(`Fallback para mockdb:`, erro.message);
      this.useMock = true;
      try {
        return await mockFn();
      } catch (mockError) {
        console.error('Erro no mockdb:', mockError);
        throw mockError;
      }
    }
  }

  /**
   * Executa query com gerenciamento automático de conexão
   * @param {Function} callback - Função que usa a conexão
   * @returns {Promise}
   */
  static async withConnection(callback) {
    const connection = await pool.getConnection();
    try {
      return await callback(connection);
    } finally {
      connection.release();
    }
  }

  /**
   * Executa múltiplas queries em transação
   * @param {Function} callback - Função que usa a conexão para múltiplas operações
   * @returns {Promise}
   */
  static async withTransaction(callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (erro) {
      await connection.rollback();
      throw erro;
    } finally {
      connection.release();
    }
  }

  /**
   * Log de operação do modelo
   * @param {string} method - Nome do método
   * @param {string} status - 'success' ou 'error'
   * @param {string} message - Mensagem opcional
   */
  static log(method, status, message = '') {
    const timestamp = new Date().toISOString();
    const source = this.useMock ? '[MOCK]' : '[DB]';
    console.log(`${timestamp} ${source} ${this.name}.${method}: ${status} ${message}`);
  }
}

module.exports = BaseModel;
