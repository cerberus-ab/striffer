'use strict';

const assert = require('assert');
const striffer = require('../src/striffer');

const assertDiffEqual = (actural, expected) => assert.equal(actural.toString(), expected.toString());

describe('Strings differ specification', () => {
    
    describe('the module', () => {
        it('should contain the number of current version', () => {
            assert.ok(typeof striffer.VERSION === 'string'); 
        });
        it('should provide function for a pair of strings', () => {
            assert.ok(typeof striffer.byPair === 'function'); 
        });
        it('should provide function for a list of strings', () => {
            assert.ok(typeof striffer.byList === 'function'); 
        });
    });
    
    describe('function byPair', () => {
        let testCases = [
            {
                desc: 'detect no differences for similar strings',
                str1: 'Hello there are 10 dogs',
                str2: 'Hello there are 10 dogs',
                diff1: [],
                diff2: []
            },
            {
                desc: 'detect in the center with the same length',
                str1: 'Hello there are about 110 dogs!',
                str2: 'Hello there was about 125 dogs!',
                diff1: [12, 15, 23, 25],
                diff2: [12, 15, 23, 25]
            }, {
                desc: 'detect in the center with different length',
                str1: 'Hello there are 5 dogs!',
                str2: 'Hello there are 123 dogs!',
                diff1: [16, 17],
                diff2: [16, 19]
            }, {
                desc: 'detect skipped characters',
                str1: 'Hello, there are 10 dogs!',
                str2: 'Hello there are about 10 dogs!',
                diff1: [5, 6],
                diff2: [16, 22]
            }, {
                desc: 'detect different tails',
                str1: 'Hello there are 10 dogs and cats',
                str2: 'Hello there are 10 dogs!',
                diff1: [23, 32],
                diff2: [23, 24]
            }, {
                desc: 'detect different heads',
                str1: 'Hello, there are 10 dogs!',
                str2: 'Good morning, there are 10 dogs!',
                diff1: [0, 5],
                diff2: [0, 12]
            }, {
                desc: 'look forward for 3 characters by default',
                str1: 'Hello, there are 110 dogs!',
                str2: 'Hello, there was 125 dogs!',
                diff1: [13, 20],
                diff2: [13, 20],
            }, {
                desc: 'respect greedy factor passed as option',
                str1: 'Hello, there are 110 dogs!',
                str2: 'Hello, there was 125 dogs!',
                diff1: [13, 16, 18, 20],
                diff2: [13, 16, 18, 20],
                options: { greedyFactor: 2 }
            }, {
                desc: 'detect permutations',
                str1: 'Hello there are 123 dogs!',
                str2: 'Hello there are 231 dogs!',
                diff1: [16, 19],
                diff2: [16, 19]
            }, {
                desc: 'pay attention on case by default',
                str1: 'Hello, my friend again!',
                str2: 'hello, my FRIEND again!',
                diff1: [0, 1, 10, 16],
                diff2: [0, 1, 10, 16]
            }, {
                desc: 'respect case insensitive flag passed as option',
                str1: 'hello, my friend again!',
                str2: 'Hello, my FRIEND again!',
                diff1: [],
                diff2: [],
                options: { caseInsensitive: true }
            }
        ];
        testCases.forEach(testCase => {
            it('should ' + testCase.desc, () => {
                let result = striffer.byPair(testCase.str1, testCase.str2, testCase.options);
                assertDiffEqual(result[0].diff, testCase.diff1);
                assertDiffEqual(result[1].diff, testCase.diff2);
            });
        });
    });
    
    describe('function byList', () => {
        it('should detect no differences for similar strings', () => {
            let result = striffer.byList([
                'Hello there are 10 dogs',
                'Hello there are 10 dogs',
                'Hello there are 10 dogs'
            ]);
            assertDiffEqual(result[0].diff, []);
            assertDiffEqual(result[1].diff, []);
            assertDiffEqual(result[2].diff, []);
        });
        
        let testCase = [
            'Hello, there are about 25 dogs',
            'Hello, there was about 1 cats',
            'Hello there were about 300 cats',
            'Hell morning, there are about 30 cats'
        ];
        it('should merge differences by each pair', () => {
            let result = striffer.byList(testCase);
            assertDiffEqual(result[0].diff, [4, 6, 13, 16, 23, 30]);
            assertDiffEqual(result[1].diff, [4, 6, 13, 16, 23, 29]);
            assertDiffEqual(result[2].diff, [4, 5, 12, 16, 23, 31]);
            assertDiffEqual(result[3].diff, [4, 13, 20, 23, 30, 37]);
        });
        it('should provide detailed response by passed flag', () => {
            let result = striffer.byList(testCase, { detailed: true });
            assert.ok(result.pairs instanceof Array);
            assert.ok(result.list instanceof Array);
            assert.equal(result.length, 4);
        });    
    });
    
});

