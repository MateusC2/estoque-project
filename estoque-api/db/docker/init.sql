CREATE DATABASE IF NOT EXISTS simple_stock;
USE simple_stock;

-- 1. Tabela de Itens (O coração do sistema)
-- Estrutura otimizada para busca e listagem direta no Front-end
CREATE TABLE item (
    idItem INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(100),                -- Marca (ex: Honda)
    description VARCHAR(255) NOT NULL,     -- Descrição completa
    currentQuantity INT DEFAULT 0,      -- Saldo atual
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabela de Histórico (Transações simplificadas)
-- Sem FK para usuário, apenas o registro da movimentação
CREATE TABLE inventory_log (
    idLog INT PRIMARY KEY AUTO_INCREMENT,
    fkIdItem INT NOT NULL,
    type ENUM('ENTRADA', 'SAIDA', 'AJUSTE') NOT NULL,
    quantityChange INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fkIdItem) REFERENCES item(idItem) ON DELETE CASCADE
);

-- Índices para garantir que o filtro no Front-end seja instantâneo
CREATE INDEX idx_brand ON item(brand);
CREATE INDEX idx_description ON item(description);

---
-- INSERÇÃO DE DADOS (Baseado na sua lista Honda)
---
INSERT INTO item (brand, description, currentQuantity) VALUES 
('HONDA', 'CIVIC 1996/2000 9"', 3),
('HONDA', 'CITY 2009/14 ANALÓGICO 10" CINZA', 2),
('HONDA', 'CITY 2009/14 ANALÓGICO 10" PRETO', 3),
('HONDA', 'CIVIC 2001/06 9"', 2),
('HONDA', 'I-KIT HONDA 2014/2021', 1),
('HONDA', 'MOLDURA HONDA CIVIC G9 2014/15 PRETO', 2);