import { Suspense } from "react";
import { getComics } from "@/lib/notion";
import ComicCard from "@/components/ComicCard";
import CollectionFilters from "@/components/CollectionFilters";

export const revalidate = 3600; // rebuild every hour

type SearchParams = Promise<{ publisher?: string; key?: string; sort?: string }>;

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { publisher, key, sort } = await searchParams;

  let comics = await getComics();

  // Filter
  if (publisher) {
    comics = comics.filter((c) => c.publisher.includes(publisher));
  }
  if (key === "1") {
    comics = comics.filter((c) => c.keyIssue);
  }

  // Sort
  if (sort === "issue") {
    comics = [...comics].sort((a, b) => (a.issue ?? 0) - (b.issue ?? 0));
  } else if (sort === "date") {
    comics = [...comics].sort((a, b) =>
      (a.date ?? "").localeCompare(b.date ?? "")
    );
  } else if (sort === "price") {
    comics = [...comics].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  }
  // default: title (already sorted from Notion)

  const allComics = await getComics();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Collection</h1>
        <p className="text-gray-400 mt-1">
          {comics.length} {comics.length === 1 ? "issue" : "issues"}
          {publisher ? ` · ${publisher}` : ""}
          {key === "1" ? " · Key Issues" : ""}
        </p>
      </div>

      <Suspense>
        <CollectionFilters total={allComics.length} />
      </Suspense>

      {comics.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          No comics found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      )}
    </div>
  );
}
