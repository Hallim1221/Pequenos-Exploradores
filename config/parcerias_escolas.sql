-- Criar tabela de parcerias com escolas
-- Execute este SQL para criar a tabela no seu banco de dados

CREATE TABLE IF NOT EXISTS parcerias_escolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_contato VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  nome_escola VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  tipo_escola VARCHAR(100) NOT NULL,
  codigo_mec VARCHAR(20),
  data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pendente',
  data_resposta DATETIME,
  especialista_id INT,
  notas TEXT,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_data (data_solicitacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de mensagens de parcerias
CREATE TABLE IF NOT EXISTS mensagens_parcerias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parceria_id INT NOT NULL,
  remetente VARCHAR(50) NOT NULL,
  conteudo TEXT NOT NULL,
  data_mensagem DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parceria_id) REFERENCES parcerias_escolas(id) ON DELETE CASCADE,
  INDEX idx_parceria (parceria_id),
  INDEX idx_data (data_mensagem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
