import axios from "axios";
import { parse, HTMLElement } from "node-html-parser";
import { decode } from "html-entities";
import { matchSorter, rankings } from "match-sorter";
import { Result } from "../typings";

const domains = {
    base: "https://developer.mozilla.org",
    reference: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
};

async function getElements() {
    const { data } = await axios.get(`${domains.base}/en-US/docs/Web/JavaScript/Reference/Global_Objects`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        }
    });
    const result = parse(data as string, { blockTextElements: { pre: true } });
    const toggles = result.querySelector("#sidebar-quicklinks").childNodes[1].childNodes[1].childNodes;
    const elements = toggles.filter(node => node.nodeType === 1);
    const hits: { name: string; type: string; url: string }[] = [];

    for (let i = 7; i < elements.length - 2; i++) {
        for (const node of elements[i].childNodes[1].childNodes[3].childNodes) {
            const element = node.childNodes[0] as HTMLElement;

            if (element.attributes.href) {
                hits.push({
                    name: decode(element.childNodes[0].rawText, { level: "all" }),
                    type: element.attributes.href.split("/")[element.attributes.href.split("/").length - 2],
                    url: `${domains.base}${element.attributes.href}`,
                });
            }
        }
    }

    return hits;
}

function htmlToMarkdown(text: string) {
    return decode(
        text
            .replace(/<code><strong>/g, "**`")
            .replace(/<\/strong><\/code>/g, "`**")
            .replace(/<strong>|<\/strong>/g, "**")
            .replace(/<code>|<\/code>/g, "`")
            .replace(/<em>|<\/em>/g, "*")
            .replace(/<sup>/g, "^")
            .replace(/<var>|<\/var>|<p>|<\/p>|<\/sup>|<span>|<\/span>|<span class="seoSummary">|<div>|<\/div>|\n|'\n'/g, "")
            .replace(/\|/g, "\u200b|")
            .trim(),
        { level: "all" }
    );
}

function getHyperLinks(text: string) {
    while (true) {
        const match = /<a.+?(?=href)href="([^"]+)".*?>([^<]+)<\/a>/.exec(text);

        if (match === null) break;

        const url = match[1].startsWith("/") ? domains.base + match[1] : match[1];

        text = text.replace(match[0], `[${match[2]}](${url})`);
    }

    return text;
}

async function parseData(link: string): Promise<Result> {
    const { data } = await axios.get(link, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        }
    });
    const result = parse(data as string, { blockTextElements: { pre: true } });
    const url = result.querySelector("link[rel='canonical']").attributes.href;
    const title = decode(result.querySelector(".title").innerText, { level: "all" });
    let text = "";

    for (let i = 2; i <= 4; i++) {
        text = result.querySelector("#content .article").childNodes[0].childNodes[i].toString();

        if (text !== "\n\n") break;
    }

    return {
        title,
        url,
        parsed: getHyperLinks(htmlToMarkdown(text)).replace(/ +(?= )/g, ""),
        raw: text,
    }
}

export default async function search(query: string) {
    const args = query
        .toLowerCase()
        .split(/#+|(?<!\.)\.{1,2}(?!\.)/g)
        .map((str: string) => str.replace(/\(|\)/g, ""))
        .filter((str: string) => str !== "prototype");
    const keyword = args[0].toLowerCase();
    const elements = await getElements();
    const hit = elements.find(el => el.name.toLowerCase() === keyword);
    const [relevant] = matchSorter(elements, keyword, {
        keys: Object.keys(elements[0]),
        threshold: rankings.NO_MATCH,
    });
    let response = "";

    if (hit) {
        response = `${domains.reference}/${hit.type}/${args.join("/")}`;
    } else {
        response = relevant.url;
    }
    
    return await parseData(response);
}
