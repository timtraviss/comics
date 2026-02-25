export const PUBLISHER_COLORS: Record<string, string> = {
  Marvel: "bg-red-600 text-white",
  DC: "bg-blue-600 text-white",
  Image: "bg-yellow-500 text-black",
  "Dark Horse": "bg-purple-600 text-white",
  Avatar: "bg-gray-600 text-white",
  Charlton: "bg-orange-600 text-white",
  IDW: "bg-amber-800 text-white",
  "Top Cow": "bg-green-600 text-white",
};

export const ALL_PUBLISHERS = [
  "Marvel",
  "DC",
  "Image",
  "Dark Horse",
  "Avatar",
  "Charlton",
  "IDW",
  "Top Cow",
];

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
  });
}

export function formatPrice(price: number | null): string {
  if (price === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
