-- Script para alterar o tamanho do campo de senha para char(60)
-- Necessário para armazenar hashes bcrypt seguramente
-- Execute este script no seu banco de dados MySQL

USE `tcc-mysql2.0`;

-- Alterar campo de senha na tabela alunos
ALTER TABLE alunos 
MODIFY COLUMN senha CHAR(60) NOT NULL;

-- Alterar campo de senha na tabela professores
ALTER TABLE professores 
MODIFY COLUMN senha CHAR(60) NOT NULL;

-- Alterar campo de senha na tabela gestao
ALTER TABLE gestao 
MODIFY COLUMN senha CHAR(60) NOT NULL;

-- Verificar as alterações
DESCRIBE alunos;
DESCRIBE professores;
DESCRIBE gestao;
