"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, Plus, SlidersHorizontal } from "lucide-react";

const allRows = [
  ["Cover page", "Cover page", "In Process", 18, 5, "Eddie Lake"],
  ["Table of contents", "Table of contents", "Done", 29, 24, "Eddie Lake"],
  ["Executive summary", "Narrative", "Done", 10, 13, "Eddie Lake"],
  ["Technical approach", "Narrative", "Done", 27, 23, "Jamik Tashpulatov"],
  ["Design", "Narrative", "In Process", 2, 16, "Jamik Tashpulatov"],
  ["Capabilities", "Narrative", "In Process", 20, 8, "Jamik Tashpulatov"],
  ["Integration with existing systems", "Narrative", "In Process", 19, 21, "Jamik Tashpulatov"],
  ["Innovation and Advantages", "Narrative", "Done", 25, 26, "Assign reviewer"],
  ["Overview of EMR's Innovative Solutions", "Technical content", "Done", 7, 23, "Assign reviewer"],
  ["Advanced Algorithms and Machine Learning", "Narrative", "Done", 30, 28, "Assign reviewer"],
  ["Roadmap", "Narrative", "Done", 11, 10, "Eddie Lake"],
  ["Risk analysis", "Narrative", "In Process", 9, 14, "Jamik Tashpulatov"],
  ["Appendix", "Technical content", "Done", 5, 7, "Assign reviewer"],
  ["Security review", "Narrative", "In Process", 16, 11, "Eddie Lake"],
];

const statusTone: Record<string, string> = {
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Process": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function DocumentsTable() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(allRows.length / rowsPerPage));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return allRows.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_-34px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            "Outline",
            "Past Performance",
            "Key Personnel",
            "Focus Documents",
          ].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Customize Columns
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs uppercase tracking-[0.16em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
              <th className="px-5 py-4">Header</th>
              <th className="px-4 py-4">Section Type</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Target</th>
              <th className="px-4 py-4">Limit</th>
              <th className="px-4 py-4">Reviewer</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row[0] as string} className="border-b border-slate-100 text-slate-700 dark:border-slate-900 dark:text-slate-200">
                <td className="px-5 py-4 font-medium">{row[0]}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">
                    {row[1]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${statusTone[row[2] as string]}`}>
                    {row[2]}
                  </span>
                </td>
                <td className="px-4 py-4">{row[3]}</td>
                <td className="px-4 py-4">{row[4]}</td>
                <td className="px-4 py-4">{row[5]}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-5 py-4 text-sm text-slate-500 dark:text-slate-400 lg:flex-row lg:items-center lg:justify-between">
        <p>0 of 68 row(s) selected.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {[10, 20, 30, 40, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <span>
            Page {page} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            {[
              { icon: ChevronsLeft, action: () => setPage(1), disabled: page === 1 },
              { icon: ChevronLeft, action: () => setPage((current) => Math.max(1, current - 1)), disabled: page === 1 },
              { icon: ChevronRight, action: () => setPage((current) => Math.min(pageCount, current + 1)), disabled: page === pageCount },
              { icon: ChevronsRight, action: () => setPage(pageCount), disabled: page === pageCount },
            ].map(({ icon: Icon, action, disabled }, index) => (
              <button
                key={index}
                type="button"
                disabled={disabled}
                onClick={action}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
