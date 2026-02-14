CREATE DATABASE IF NOT EXISTS simple_stock;
USE simple_stock;

-- 1. Tabela de Itens
-- Estrutura simples e otimizada
CREATE TABLE item (
    idItem INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    currentQuantity INT DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabela de Transações/Histórico
-- Registro simples de movimentações
CREATE TABLE inventory_log (
    idLog INT PRIMARY KEY AUTO_INCREMENT,
    fkIdItem INT NOT NULL,
    type ENUM('ENTRADA', 'SAIDA', 'AJUSTE') NOT NULL,
    quantityChange INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fkIdItem) REFERENCES item(idItem) ON DELETE CASCADE
);

-- Índices para otimizar buscas
CREATE INDEX idx_brand ON item(brand);
CREATE INDEX idx_description ON item(description);
CREATE INDEX idx_fkIdItem ON inventory_log(fkIdItem);

-- ===================================
-- DADOS FICTÍCIOS PARA TESTES
-- ===================================

-- Inserindo itens de exemplo
INSERT INTO item (brand, description, currentQuantity) VALUES 
('HONDA', 'CIVIC 1996/2000 9"', 5),
('HONDA', 'CITY 2009/14 ANALÓGICO 10" CINZA', 3),
('HONDA', 'CITY 2009/14 ANALÓGICO 10" PRETO', 8),
('HONDA', 'CIVIC 2001/06 9"', 2),
('HONDA', 'I-KIT HONDA 2014/2021', 1),
('HONDA', 'MOLDURA HONDA CIVIC G9 2014/15 PRETO', 4),
('TOYOTA', 'COROLLA 2014/2019 TELA 10"', 6),
('TOYOTA', 'ETIOS 2012/2020 TELA 8"', 3),
('TOYOTA', 'HILUX 2016/2021 TELA 9"', 2),
('VOLKSWAGEN', 'GOL 1995/2005 TELA 7"', 7),
('VOLKSWAGEN', 'PASSAT 2012/2020 TELA 10.25"', 1),
('FORD', 'NEW FIESTA 2011/2019 TELA 6.5"', 5),
('FORD', 'FOCUS 2009/2016 TELA 8"', 4),
('CHEVROLET', 'CRUZE 2009/2016 TELA 8"', 3),
('CHEVROLET', 'TRACKER 2013/2020 TELA 7"', 2);

-- Inserindo transações de exemplo (movimentação de estoque)
INSERT INTO inventory_log (fkIdItem, type, quantityChange, timestamp) VALUES 
-- Primeiro item - CIVIC
(1, 'ENTRADA', 5, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(1, 'SAIDA', 2, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(1, 'AJUSTE', 2, DATE_SUB(NOW(), INTERVAL 25 DAY)),

-- Segundo item - CITY CINZA
(2, 'ENTRADA', 5, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 15 DAY)),

-- Terceiro item - CITY PRETO
(3, 'ENTRADA', 8, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(3, 'SAIDA', 3, DATE_SUB(NOW(), INTERVAL 20 DAY)),

-- Quarto item - CIVIC 2001
(4, 'ENTRADA', 3, DATE_SUB(NOW(), INTERVAL 35 DAY)),
(4, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),

-- Quinto item - I-KIT
(5, 'ENTRADA', 2, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(5, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- Sexto item - MOLDURA
(6, 'ENTRADA', 6, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(6, 'SAIDA', 2, DATE_SUB(NOW(), INTERVAL 18 DAY)),

-- Sétimo item - COROLLA TOYOTA
(7, 'ENTRADA', 8, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(7, 'SAIDA', 2, DATE_SUB(NOW(), INTERVAL 25 DAY)),

-- Oitavo item - ETIOS
(8, 'ENTRADA', 4, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(8, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 16 DAY)),

-- Nono item - HILUX
(9, 'ENTRADA', 3, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(9, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 14 DAY)),

-- Décimo item - GOL
(10, 'ENTRADA', 10, DATE_SUB(NOW(), INTERVAL 32 DAY)),
(10, 'SAIDA', 3, DATE_SUB(NOW(), INTERVAL 28 DAY)),

-- Décimo primeiro item - PASSAT
(11, 'ENTRADA', 2, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(11, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),

-- Décimo segundo item - NEW FIESTA
(12, 'ENTRADA', 7, DATE_SUB(NOW(), INTERVAL 26 DAY)),
(12, 'SAIDA', 2, DATE_SUB(NOW(), INTERVAL 22 DAY)),

-- Décimo terceiro item - FOCUS
(13, 'ENTRADA', 6, DATE_SUB(NOW(), INTERVAL 24 DAY)),
(13, 'SAIDA', 2, DATE_SUB(NOW(), INTERVAL 20 DAY)),

-- Décimo quarto item - CRUZE
(14, 'ENTRADA', 5, DATE_SUB(NOW(), INTERVAL 21 DAY)),
(14, 'SAIDA', 2, DATE_SUB(NOW(), INTERVAL 17 DAY)),

-- Décimo quinto item - TRACKER
(15, 'ENTRADA', 3, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(15, 'SAIDA', 1, DATE_SUB(NOW(), INTERVAL 15 DAY));
