import Link from "next/link";
import { getComics } from "@/lib/notion";
import ComicCard from "@/components/ComicCard";
import { PUBLISHER_COLORS, formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export default async function HomePage() {
  const comics = await getComics();

  const totalValue = comics.reduce((sum, c) => sum + (c.price ?? 0), 0);
  const keyIssues = comics.filter((c) => c.keyIssue);
  const iccCount = comics.filter((c) => c.icc).length;

  // Publisher breakdown
  const publisherCounts: Record<string, number> = {};
  for (const comic of comics) {
    for (const pub of comic.publisher) {
      publisherCounts[pub] = (publisherCounts[pub] ?? 0) + 1;
    }
  }
  const publisherList = Object.entries(publisherCounts).sort((a, b) => b[1] - a[1]);

  // Recent additions (reverse title-sorted list as a proxy)
  const recent = [...comics].reverse().slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          My Comic Collection
        </h1>
        <p className="mt-3 text-gray-400 text-lg max-w-xl">
          A personal archive of {comics.length} issues spanning Marvel, DC, Image and beyond.
        </p>
        <div className="mt-6">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse collection →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          At a glance
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Issues" value={comics.length.toString()} />
          <StatCard label="Collection Value" value={formatPrice(totalValue)} />
          <StatCard label="Key Issues" value={keyIssues.length.toString()} />
          <StatCard label="ICC Certified" value={iccCount.toString()} />
        </div>
      </section>

      {/* Publisher breakdown */}
      <section>
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          By publisher
        </h2>
        <div className="flex flex-wrap gap-3">
          {publisherList.map(([pub, count]) => (
            <Link
              key={pub}
              href={`/collection?publisher=${encodeURIComponent(pub)}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80 ${PUBLISHER_COLORS[pub] ?? "bg-gray-600 text-white"}`}
            >
              {pub}
              <span className="text-xs opacity-75 font-normal">
                {count} {count === 1 ? "issue" : "issues"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Key issues spotlight */}
      {keyIssues.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm uppercase tracking-widest text-gray-500">
              Key Issues
            </h2>
            <Link
              href="/collection?key=1"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {keyIssues.slice(0, 6).map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </section>
      )}

      {/* Recently added */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-500">
            Recently Added
          </h2>
          <Link
            href="/collection"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recent.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
