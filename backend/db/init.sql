CREATE TABLE desenvolvedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  nivel VARCHAR(20) CHECK (nivel IN ('Junior','Pleno','Senior'))
);

CREATE TABLE habilidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL
);

CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  dev_id INT REFERENCES desenvolvedores(id) ON DELETE CASCADE
);

CREATE TABLE dev_habilidades (
  dev_id INT REFERENCES desenvolvedores(id) ON DELETE CASCADE,
  hab_id INT REFERENCES habilidades(id) ON DELETE CASCADE,
  PRIMARY KEY (dev_id, hab_id)
);

-- Dados de exemplo
INSERT INTO desenvolvedores (nome, email, nivel) VALUES
  ('Alice Silva', 'alice@example.com', 'Senior'),
  ('Bob Costa', 'bob@example.com', 'Pleno'),
  ('Carlos Santos', 'carlos@example.com', 'Junior');

INSERT INTO habilidades (nome) VALUES
  ('JavaScript'),
  ('Python'),
  ('React'),
  ('Node.js'),
  ('PostgreSQL'),
  ('Docker');

INSERT INTO projetos (nome, descricao, dev_id) VALUES
  ('DevCard App', 'Aplicação de gerenciamento de desenvolvedores', 1),
  ('API REST', 'Sistema de API com Express', 2),
  ('Dashboard', 'Dashboard analítico', 1);

INSERT INTO dev_habilidades (dev_id, hab_id) VALUES
  (1, 1), (1, 3), (1, 4), (1, 5), (1, 6),
  (2, 1), (2, 4), (2, 5),
  (3, 1), (3, 2);