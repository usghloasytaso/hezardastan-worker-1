import { XMLParser } from 'fast-xml-parser';

export interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
}

export async function fetchRssFeed(rssUrl: string): Promise<RssItem[]> {
  const response = await fetch(rssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html, */*'
    }
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت فید RSS (${response.status} ${response.statusText})`);
  }

  const xmlText = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    processEntities: false
  });

  const parsed = parser.parse(xmlText);
  const items: RssItem[] = [];

  // ۱. پشتیبانی از ساختار استاندارد RSS 2.0 (<rss><channel><item>)
  const channelItems = parsed?.rss?.channel?.item;
  if (channelItems) {
    const rawItems = Array.isArray(channelItems) ? channelItems : [channelItems];
    for (const it of rawItems) {
      const link = extractLink(it?.link || it?.guid);
      const title = extractString(it?.title);
      const pubDate = extractString(it?.pubDate || it?.['dc:date']);
      if (link && isValidUrl(link)) {
        items.push({ title, link, pubDate });
      }
    }
    return items;
  }

  // ۲. پشتیبانی از ساختار Atom (<feed><entry>)
  const feedEntries = parsed?.feed?.entry;
  if (feedEntries) {
    const rawEntries = Array.isArray(feedEntries) ? feedEntries : [feedEntries];
    for (const entry of rawEntries) {
      let link = '';
      if (Array.isArray(entry.link)) {
        const alt = entry.link.find((l: any) => l['@_rel'] === 'alternate') || entry.link[0];
        link = alt?.['@_href'] || '';
      } else if (typeof entry.link === 'object') {
        link = entry.link?.['@_href'] || '';
      } else {
        link = extractString(entry.link);
      }

      const title = extractString(entry.title);
      const pubDate = extractString(entry.published || entry.updated);
      if (link && isValidUrl(link)) {
        items.push({ title, link, pubDate });
      }
    }
    return items;
  }

  // ۳. ساختار RDF (<rdf:RDF><item>)
  const rdfItems = parsed?.['rdf:RDF']?.item;
  if (rdfItems) {
    const rawRdf = Array.isArray(rdfItems) ? rdfItems : [rdfItems];
    for (const it of rawRdf) {
      const link = extractLink(it?.link);
      const title = extractString(it?.title);
      const pubDate = extractString(it?.['dc:date']);
      if (link && isValidUrl(link)) {
        items.push({ title, link, pubDate });
      }
    }
    return items;
  }

  return items;
}

function extractString(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val['#text']) return String(val['#text']).trim();
  return String(val).trim();
}

function extractLink(linkField: any): string {
  if (!linkField) return '';
  if (typeof linkField === 'string') return linkField.trim();
  if (typeof linkField === 'object') {
    if (linkField['@_href']) return linkField['@_href'].trim();
    if (linkField['#text']) return linkField['#text'].trim();
  }
  return '';
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
