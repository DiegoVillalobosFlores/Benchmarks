type Benchmark = {
  id: number;
  created_at: Date;
  updated_at: Date;
  fps?: number;
  frametime?: number;
  cpu_load?: number;
  cpu_power?: number;
  gpu_load?: number;
  cpu_temp?: number;
  gpu_temp?: number;
  gpu_core_clock?: number;
  gpu_mem_clock?: number;
  gpu_vram_used?: number;
  gpu_power?: number;
  ram_used?: number;
  swap_used?: number;
  process_rss?: number;
  elapsed?: number;
  game_id?: number;
};

export default Benchmark;
