ALTER TABLE "BenchmarkMetric" ADD cpu_mhz integer;
ALTER TABLE "Benchmark" ADD file_name text;

INSERT INTO Game (id, name, steam_id) VALUES (2, 'Monster Hunter Wilds', '2246340');
