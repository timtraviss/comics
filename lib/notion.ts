import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// The Notion data source ID (collection ID) for the Comic Collection database
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID ?? "dfac3e5d-6b3c-47e9-8000-7ec75e546cac";

export type Comic = {
  id: string;
  title: string;
  issue: number | null;
  date: string | null;
  publisher: string[];
  cover: string | null;
  keyIssue: boolean;
  icc: boolean;
  price: number | null;
  description: string;
  externalUrl: string | null;
};

function pageToComic(page: PageObjectResponse): Comic {
  const p = page.properties;

  const title =
    p["Title"]?.type === "title"
      ? p["Title"].title.map((t) => t.plain_text).join("")
      : "";

  const issue =
    p["Issue"]?.type === "number" ? p["Issue"].number : null;

  const date =
    p["Date"]?.type === "date" ? p["Date"].date?.start ?? null : null;

  const publisher =
    p["Publisher"]?.type === "multi_select"
      ? p["Publisher"].multi_select.map((s) => s.name)
      : [];

  const cover =
    p["Cover"]?.type === "select" ? p["Cover"].select?.name ?? null : null;

  const keyIssue =
    p["Key Issue"]?.type === "select"
      ? p["Key Issue"].select?.name === "Key Issue"
      : false;

  const icc =
    p["ICC"]?.type === "checkbox" ? p["ICC"].checkbox : false;

  const price =
    p["Price"]?.type === "number" ? p["Price"].number : null;

  const description =
    p["Description"]?.type === "rich_text"
      ? p["Description"].rich_text.map((t) => t.plain_text).join("")
      : "";

  const externalUrl =
    p["URL"]?.type === "url" ? p["URL"].url : null;

  return {
    id: page.id,
    title,
    issue,
    date,
    publisher,
    cover,
    keyIssue,
    icc,
    price,
    description,
    externalUrl,
  };
}

export async function getComics(): Promise<Comic[]> {
  const comics: Comic[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      sorts: [{ property: "Title", direction: "ascending" }],
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (isFullPage(page)) {
        comics.push(pageToComic(page));
      }
    }

    cursor = response.next_cursor ?? undefined;
  } while (cursor);

  return comics;
}

export async function getComic(id: string): Promise<Comic | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (isFullPage(page)) {
      return pageToComic(page);
    }
    return null;
  } catch {
    return null;
  }
}
