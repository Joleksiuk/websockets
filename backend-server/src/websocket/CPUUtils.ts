import * as os from "os";

export function calculateCpuLoad(): { idle: number; usage: number } {
  const cpus = os.cpus();
  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;

  cpus.forEach((core) => {
    user += core.times.user;
    nice += core.times.nice;
    sys += core.times.sys;
    idle += core.times.idle;
    irq += core.times.irq;
  });

  const total = user + nice + sys + idle + irq;
  return {
    idle: idle / total,
    usage: 1 - idle / total,
  };
}

export function logCpuLoad(): void {
  const { usage } = calculateCpuLoad();
  console.log(`CPU Usage: ${(usage * 100).toFixed(2)}%`);
}
