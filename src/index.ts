import axios from 'axios';
import { MdnAPI, Document, Result, Error } from './types';

const domain = 'https://developer.mozilla.org';
const cache = new Map<string, Document>();

export default async function search(query: string): Promise<Result | Error> {
    query = query.trim();

    try {
        const qString = `${domain}/api/v1/search?${new URLSearchParams({
            q: query,
        }).toString()}`;

        let hit = cache.get(qString);

        if (!hit) {
            const result = (await axios
                .get(qString)
                .then(data => data.data)) as MdnAPI;
            hit = result.documents?.[0];

            if (hit) {
                cache.set(qString, hit);
            }
        }

        if (!hit) {
            return {
                error: `No search result found for query ${query}`,
            };
        }

        return {
            url: `${domain}${hit.mdn_url}`,
            title: hit.title,
            confidence: hit.score,
            summary: hit.summary,
        };
    } catch {
        return {
            error: 'Internal server error',
        };
    }
}
