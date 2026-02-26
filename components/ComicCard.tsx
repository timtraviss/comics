"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Comic } from "@/lib/notion";
import { PUBLISHER_COLORS, formatPrice } from "@/lib/utils";

export default function ComicCard({ comic }: { comic: Comic }) {
  const [imgError, setImgError] = useState(false);
  const coverSrc = imgError || !comic.coverUrl ? "/covers/placeholder.jpg" : comic.coverUrl;

  return (
    <Link
      href={`/comic/${comic.id}`}
      className="group block bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40"
    >
      {/* Cover image */}
      <div className="relative aspect-[2/3] bg-gray-900">
        <Image
          src={coverSrc}
          alt={`${comic.title} #${comic.issue ?? ""} cover`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          onError={() => setImgError(true)}
        />
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {comic.keyIssue && (
            <span className="text-xs font-bold bg-yellow-400 text-black px-1.5 py-0.5 rounded">
              KEY
            </span>
          )}
          {comic.icc && (
            <span className="text-xs font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">
              ICC
            </span>
          )}
        </div>
        {comic.cover && comic.cover !== "Only Cover" && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-black/70 text-gray-300 px-1.5 py-0.5 rounded">
              {comic.cover}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-gray-100">
          {comic.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {comic.issue !== null ? `#${comic.issue}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {comic.publisher.map((pub) => (
            <span
              key={pub}
              className={`text-xs px-1.5 py-0.5 rounded font-medium ${PUBLISHER_COLORS[pub] ?? "bg-gray-600 text-white"}`}
            >
              {pub}
            </span>
          ))}
        </div>
        {comic.price !== null && (
          <p className="text-xs text-gray-400 mt-2">{formatPrice(comic.price)}</p>
        )}
      </div>
    </Link>
  );
}
