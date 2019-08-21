'use strict';

const assert = require('assert');
const striffer = require('../src/striffer');

describe('Strings differ performance', () => {
    
    // the template for the strings and its options
    const STRING_TEMPLATE = 'The Lord of the Rings is {genre} novel written '
        + 'by {regalia} Tolkien. The story began as {reference}'
        + 'to Tolkien\'s {year} fantasy novel The Hobbit, '
        + 'but eventually developed into {result}.';
    
    const RND_GENRE = [
        'an epic high fantasy',
        'sword and sorcery',
        'the most interesting',
        'a great heroic fantasy',
        'that',
    ];
    
    const RND_REGALIA = [
        'English author and scholar',
        'Deutsch scholar',
        'researcher from England',
        'teacher and professor',
        'scientist or lowyer',
    ];
    
    const RND_REFERENCE = [
        'a sequel',
        'the sequel',
        'a prequel',
        'the reboot',
        'novel series',
    ];
    
    const RND_RESULT = [
        'a much larger work',
        'the smallest work',
        'something else',
        'a movie',
        'advanced writing',
    ];
    
    // helpers for randomizer
    const getrnd = arr => arr[Math.floor(Math.random() * arr.length)];
    
    const replace = (str, data) => str.replace(/{(\w+)}/g, (match, key) => data[key]);
    
    // the test
    let repeats = 100;
    let testCases = [2, 10, 40, 100];
    
    testCases.forEach((amount, index) => {
        it(`should pass over ${amount} strings`, () => {
            let strs = Array.from(Array(amount)).map((_, i) => replace(STRING_TEMPLATE, {
                genre: getrnd(RND_GENRE),
                regalia: getrnd(RND_REGALIA),
                reference: getrnd(RND_REFERENCE),
                result: getrnd(RND_RESULT),
                year: 1900 + i
            }));
            let tbeg = +new Date;
            for (let i = 0, result; i !== repeats; result = striffer.byList(strs), i += 1);
            console.log(`  Test ${(index + 1)}. Finished over ${amount} strings in ${(+new Date - tbeg)} ms (${repeats} times)`);
            assert.ifError(null);
        });
    });
    
    
});