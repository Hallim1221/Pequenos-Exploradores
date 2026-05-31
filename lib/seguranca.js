const bcrypt = require('bcrypt');

class Seguranca {
  // Número de salt rounds para bcrypt
  static SALT_ROUNDS = 10;

  /**
   * Gerar hash de senha
   * @param {string} senha - Senha em texto plano
   * @returns {Promise<string>} Senha hasheada
   */
  static async hashSenha(senha) {
    try {
      const hash = await bcrypt.hash(senha, this.SALT_ROUNDS);
      return hash;
    } catch (erro) {
      console.error('Erro ao gerar hash:', erro);
      throw new Error('Erro ao processar senha');
    }
  }

  /**
   * Comparar senha com hash
   * @param {string} senha - Senha em texto plano
   * @param {string} hash - Hash da senha armazenado
   * @returns {Promise<boolean>} True se corresponder
   */
  static async verificarSenha(senha, hash) {
    try {
      const corresponde = await bcrypt.compare(senha, hash);
      return corresponde;
    } catch (erro) {
      console.error('Erro ao verificar senha:', erro);
      return false;
    }
  }

  /**
   * Validar força da senha
   * Mínimo: 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
   * @param {string} senha - Senha a validar
   * @returns {Object} { valida: boolean, erros: string[] }
   */
  static validarForcaSenha(senha) {
    const erros = [];

    if (!senha || senha.length < 8) {
      erros.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(senha)) {
      erros.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(senha)) {
      erros.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(senha)) {
      erros.push('Senha deve conter pelo menos um número');
    }

    return {
      valida: erros.length === 0,
      erros: erros
    };
  }

  /**
   * Gerar token simples para verificação de email
   * @returns {string} Token aleatório
   */
  static gerarToken(tamanho = 32) {
    return require('crypto').randomBytes(tamanho).toString('hex');
  }

  /**
   * Sanitizar dados de entrada (previne XSS básico)
   * @param {string} entrada - String a sanitizar
   * @returns {string} String sanitizada
   */
  static sanitizar(entrada) {
    if (typeof entrada !== 'string') return entrada;
    
    return entrada
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validar email
   * @param {string} email - Email a validar
   * @returns {boolean} True se email válido
   */
  static validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  /**
   * Gerar token JWT simples (sem library externa)
   * Nota: Para produção, use jsonwebtoken
   * @param {Object} dados - Dados para codificar
   * @returns {string} Token simples
   */
  static gerarTokenSimples(dados) {
    return Buffer.from(JSON.stringify(dados)).toString('base64');
  }

  /**
   * Decodificar token JWT simples
   * @param {string} token - Token a decodificar
   * @returns {Object} Dados decodificados ou null
   */
  static decodificarTokenSimples(token) {
    try {
      return JSON.parse(Buffer.from(token, 'base64').toString());
    } catch (erro) {
      return null;
    }
  }
}

module.exports = Seguranca;
