"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ALL_PUBLISHERS, PUBLISHER_COLORS } from "@/lib/utils";

export default function CollectionFilters({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const publisher = params.get("publisher") ?? "";
  const keyOnly = params.get("key") === "1";
  const sort = params.get("sort") ?? "title";

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      router.push(`/collection?${next.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Publisher filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update("publisher", "")}
          className={`text-sm px-3 py-1 rounded-full border transition-colors ${
            !publisher
              ? "bg-white text-black border-white"
              : "border-white/20 text-gray-400 hover:border-white/40"
          }`}
        >
          All ({total})
        </button>
        {ALL_PUBLISHERS.map((pub) => (
          <button
            key={pub}
            onClick={() => update("publisher", publisher === pub ? "" : pub)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              publisher === pub
                ? `${PUBLISHER_COLORS[pub] ?? "bg-gray-600 text-white"} border-transparent`
                : "border-white/20 text-gray-400 hover:border-white/40"
            }`}
          >
            {pub}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Key issues toggle */}
      <button
        onClick={() => update("key", keyOnly ? "" : "1")}
        className={`text-sm px-3 py-1 rounded-full border transition-colors ${
          keyOnly
            ? "bg-yellow-400 text-black border-yellow-400"
            : "border-white/20 text-gray-400 hover:border-white/40"
        }`}
      >
        ★ Key Issues
      </button>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => update("sort", e.target.value)}
        className="text-sm bg-white/5 border border-white/20 rounded-full px-3 py-1 text-gray-300 focus:outline-none focus:border-white/40"
      >
        <option value="title">Sort: Title A–Z</option>
        <option value="issue">Sort: Issue #</option>
        <option value="date">Sort: Date</option>
        <option value="price">Sort: Value</option>
      </select>
    </div>
  );
}
