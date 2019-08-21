'use strict';

const assert = require('assert');
const striffer = require('../src/striffer');

describe('Strings differ performance', () => {
    
    const BASE_STRINGS = [
        'The quick brown fox jumps over {number} lazy dogs',
        'An quick orange fox jumps over {number} lazy kittens'
    ];
    const REPEATS_NUMBER = 1000;
    
    let testCases = [2, 10, 40, 100];
    
    testCases.forEach((amount, index) => {
        it(`should pass over ${amount} strings`, () => {
            let strs = Array.from(Array(amount)).map((_, i) => BASE_STRINGS[i % 2].replace(/\{number\}/i, i + 31));
            let tbeg = +new Date;
            for (let i = 0, result; i !== REPEATS_NUMBER; result = striffer.byList(strs), i += 1);
            console.log(`  Test ${(index + 1)}. Finished over ${amount} strings in ${(+new Date - tbeg)} ms`);
            assert.ifError(null);
        });
    });
    
    
});