"use client";

const mobileSeries = [
  22, 28, 26, 42, 36, 30, 48, 34, 52, 38, 44, 58, 46, 64, 54, 42, 40, 62, 44,
  66, 52, 48, 70, 60, 50, 74, 56, 68, 54, 72,
];

const desktopSeries = [
  18, 20, 22, 30, 26, 24, 34, 28, 36, 30, 32, 42, 34, 46, 40, 28, 26, 44, 30,
  48, 34, 30, 52, 42, 32, 56, 38, 50, 40, 54,
];

function toPath(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const step = width / (values.length - 1);

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - (value / max) * (height - 12) - 6;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
}

function toArea(values: number[], width: number, height: number) {
  const line = toPath(values, width, height).replace("M ", "");
  return `M 0,${height} L ${line} L ${width},${height} Z`;
}

export default function VisitorsChart() {
  const width = 920;
  const height = 260;
  const mobileLine = toPath(mobileSeries, width, height);
  const desktopLine = toPath(desktopSeries, width, height);
  const mobileArea = toArea(mobileSeries, width, height);
  const desktopArea = toArea(desktopSeries, width, height);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-34px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
            Total Visitors
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Total for the last 3 months
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Last 3 months", "Last 30 days", "Last 7 days"].map((label, index) => (
            <button
              key={label}
              type="button"
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                index === 0
                  ? "border-slate-300 bg-slate-100 text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[320px] rounded-[24px] bg-[linear-gradient(to_bottom,_rgba(248,250,252,0.7),_rgba(255,255,255,0))] px-2 pt-4 dark:bg-[linear-gradient(to_bottom,_rgba(15,23,42,0.45),_rgba(2,6,23,0))]">
        <div className="absolute inset-x-0 top-6 bottom-12 grid grid-rows-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="border-b border-dashed border-slate-200/80 dark:border-slate-800"
            />
          ))}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="relative z-10 h-[260px] w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <path d={mobileArea} fill="rgba(17,24,39,0.22)" />
          <path d={desktopArea} fill="rgba(17,24,39,0.1)" />
          <path
            d={mobileLine}
            fill="none"
            stroke="rgba(17,24,39,0.72)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={desktopLine}
            fill="none"
            stroke="rgba(17,24,39,0.38)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute left-[12%] top-[38%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <p className="font-medium text-slate-900 dark:text-slate-100">Apr 11</p>
          <div className="mt-2 space-y-1 text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between gap-5">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-900 dark:bg-slate-100" />
                Mobile
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">350</span>
            </div>
            <div className="flex items-center justify-between gap-5">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                Desktop
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">327</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between px-2 text-xs text-slate-400 dark:text-slate-500">
          {["Apr 2", "Apr 8", "Apr 14", "Apr 21", "Apr 28", "May 5", "May 12", "May 19", "May 26", "Jun 2", "Jun 8", "Jun 15", "Jun 22", "Jun 30"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
