"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Comic } from "@/lib/notion";
import { PUBLISHER_COLORS, formatDate, formatPrice } from "@/lib/utils";

export default function ComicPage() {
  const { id } = useParams<{ id: string }>();
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch(`/api/comic/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setComic(data.comic ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const coverSrc = imgError ? "/covers/placeholder.jpg" : `/covers/${id}.jpg`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Loading…
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">Comic not found.</p>
        <Link href="/collection" className="text-blue-400 hover:underline text-sm">
          ← Back to collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/collection"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* Cover */}
        <div className="relative aspect-[2/3] w-full max-w-[280px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
          <Image
            src={coverSrc}
            alt={`${comic.title} cover`}
            fill
            className="object-cover"
            sizes="280px"
            onError={() => setImgError(true)}
            priority
          />
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {comic.publisher.map((pub) => (
              <span
                key={pub}
                className={`text-sm px-2 py-0.5 rounded font-medium ${PUBLISHER_COLORS[pub] ?? "bg-gray-600 text-white"}`}
              >
                {pub}
              </span>
            ))}
            {comic.keyIssue && (
              <span className="text-sm font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">
                ★ Key Issue
              </span>
            )}
            {comic.icc && (
              <span className="text-sm font-bold bg-blue-500 text-white px-2 py-0.5 rounded">
                ICC Certified
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            {comic.title}
          </h1>
          {comic.issue !== null && (
            <p className="text-2xl text-gray-400 mt-1">#{comic.issue}</p>
          )}

          {comic.description && (
            <p className="mt-4 text-gray-300 leading-relaxed max-w-prose">
              {comic.description}
            </p>
          )}

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DataItem label="Published" value={formatDate(comic.date)} />
            <DataItem label="Value" value={formatPrice(comic.price)} />
            {comic.cover && (
              <DataItem label="Cover" value={comic.cover} />
            )}
          </dl>

          {comic.externalUrl && (
            <a
              href={comic.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-6 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              View reference ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="text-white font-medium mt-0.5">{value}</dd>
    </div>
  );
}
