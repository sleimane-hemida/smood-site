CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
ON contact_messages (created_at DESC);

CREATE TABLE IF NOT EXISTS visits (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(120) NOT NULL,
  page_path VARCHAR(255) NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visits_visited_at_idx
ON visits (visited_at DESC);

CREATE INDEX IF NOT EXISTS visits_session_id_idx
ON visits (session_id);