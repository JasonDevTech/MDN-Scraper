jest.dontMock('../src/index');

import search from '../src/index';

describe('return an error for', () => {
    it('String.format', async () => {
        const data = await search('String.format');

        expect(data).toMatchObject({ error: 'Not Found' });
    });

    it('String.nothing', async () => {
        const data = await search('String.nothing');

        expect(data).toMatchObject({ error: 'Not Found' });
    });
});

describe('return data for', () => {
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

    for (const query of queries) {
        it(query, async () => {
            const data = await search(query.replace(/prototype|\(|\)/g, ''));

            expect(data).toHaveProperty('title');
            expect(data).toHaveProperty('url');
            expect(data).toHaveProperty('parsed');
            expect(data).toHaveProperty('raw');
        });
    }
});
