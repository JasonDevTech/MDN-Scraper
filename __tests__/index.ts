jest.dontMock('../src/index');

import search from '../src/index';
import { Result } from '../src/types';

const queries = [
    'Array.prototype.join()',
    'Array.prototype.join',
    'Array#prototype#join()',
    'Array#prototype#join',
    'Array.join()',
    'Array.join',
    'Array#join()',
    'Array#join',
    'String#replace',
    'number',
    'template literals',
    'array',
    'string',
    'delete',
    'this',
    'eval()',
    'for...of',
    'for...in',
    'import',
    'class',
    'function',
    'function*',
    'arguments',
    'arrow functions',
    'split',
    'logical or',
    'logical and',
    'nullish',
];

describe('return data for', () => {
    for (const query of queries) {
        it(query, async () => {
            const data = await search(query);

            expect(data).toHaveProperty('url');
            expect(data).toHaveProperty('title');
            expect(data).toHaveProperty('confidence');
            expect(data).toHaveProperty('summary');
        });
    }
});

describe('check property types', () => {
    for (const query of queries) {
        it(query, async () => {
            const data = (await search(query)) as Result;

            expect(data.url).toBeTruthy();
            expect(data.title).toBeTruthy();
            expect(data.confidence).toBeTruthy();
            expect(data.summary).toBeTruthy();
        });
    }
});
