interface Highlight {
    body: string[];
    title: string[];
}

interface Document {
    mdn_url: string;
    score: number;
    title: string;
    locale: string;
    slug: string;
    popularity: number;
    archived: boolean;
    summary: string;
    highlight: Highlight;
}

interface Total {
    value: number;
    relation: string;
}

interface Metadata {
    took_ms: number;
    total: Total;
    size: number;
    page: number;
}

interface MdnAPI {
    documents?: Document[];
    metadata: Metadata;
    suggestions: any[];
}

interface Result {
    url: string;
    title: string;
    confidence: number;
    summary: string;
}

interface Error {
    error: string;
}

export { MdnAPI, Document, Result, Error };
