CREATE DATABASE Escola;

USE Escola;

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    altura DECIMAL(4,2),
    endereco VARCHAR(200)
);

INSERT INTO alunos (nome, altura, endereco) VALUES
('Ana Clara', 1.65, 'Rua das Flores, 123'),
('Bruno Martins', 1.78, 'Av. Central, 456'),
('Carlos Silva', 1.72, 'Rua Nova Esperança, 89'),
('Daniela Costa', 1.68, 'Travessa da Paz, 10'),
('Eduarda Lima', 1.60, 'Rua das Palmeiras, 77'),
('Felipe Rocha', 1.80, 'Av. Brasil, 301'),
('Gabriela Nunes', 1.70, 'Rua do Sol, 45'),
('Henrique Souza', 1.75, 'Rua das Acácias, 88'),
('Isabela Torres', 1.62, 'Rua Bela Vista, 22'),
('João Pedro', 1.85, 'Av. Independência, 999');