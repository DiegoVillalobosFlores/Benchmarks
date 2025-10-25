CREATE TABLE IF NOT EXISTS "Game" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  steam_id TEXT
);

CREATE TABLE IF NOT EXISTS "Benchmark" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  game_id INTEGER NOT NULL,
  FOREIGN KEY (game_id) REFERENCES Game(id)
);

CREATE TABLE IF NOT EXISTS "BenchmarkMetric" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  fps INTEGER,
  frametime INTEGER,
  cpu_load INTEGER,
  cpu_power INTEGER,
  gpu_load INTEGER,
  cpu_temp INTEGER,
  gpu_temp INTEGER,
  gpu_core_clock INTEGER,
  gpu_mem_clock INTEGER,
  gpu_vram_used INTEGER,
  gpu_power INTEGER,
  ram_used INTEGER,
  swap_used INTEGER,
  process_rss INTEGER,
  elapsed INTEGER,
  benchmark_id INTEGER NOT NULL,
  FOREIGN KEY (benchmark_id) REFERENCES Benchmark(id)
);

DELETE FROM Game;

INSERT INTO Game (id, name, steam_id) VALUES (1, 'Resident Evil 4', '2050650');
