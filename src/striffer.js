;(function() {
    
    // meta
    const VERSION = '0.1.0';
    
    // defaults
    const DEFAULT_SETTINGS = {
        greedyFactor: 3,
        caseInsensitive: false,
        detailed: false
    }
    
    // helpers
    const getOptions = opts => Object.assign({}, DEFAULT_SETTINGS, typeof opts === 'object' && opts || {});
    
    /*
     * Get differences between two strings
     *
     * @param {string} str1
     * @param {string} str2
     * @param {object} opts
     * @return {Array<object>}
     */
    function byPair(str1, str2, opts = null) {
        let options = getOptions(opts);

        let ustr1 = options.caseInsensitive ? str1.toLowerCase() : str1;
        let ustr2 = options.caseInsensitive ? str2.toLowerCase() : str2;
        
        let d1 = [], b1 = '', i1 = 0, s1 = '';
        let d2 = [], b2 = '', i2 = 0, s2 = '';
  
        const find = (str, trg) => trg.length >= options.greedyFactor ? str.indexOf(trg) : -1;
        
        const process = (dr1, dr2, i1, i2, io, blen) => {
            push(dr1, 1 + i1 - blen, 1 + i1 - options.greedyFactor);
            if (io) push(dr2, 1 + i2 - blen, 1 + i2 + io - blen);
            return options.greedyFactor + io - blen;
        };
  
        const push = (dr, beg, end) => {
            dr.push(beg);
            dr.push(end);
        };
  
        while (1) {
            s1 = ustr1[i1] || '';
            s2 = ustr2[i2] || '';
            if (!s1 && !s2) break;
    
            if (s1 !== s2 || b1 || b2) {
                b1 += s1;
                b2 += s2;
            }
            if (b1.length >= options.greedyFactor || b2.length >= options.greedyFactor) {
                let io1 = find(b2, b1.substr(-options.greedyFactor));
                let io2 = find(b1, b2.substr(-options.greedyFactor));

                if ((~io1 && !~io2) || (~io1 && ~io2 && io1 < io2)) {
                    i2 += process(d1, d2, i1, i2, io1, b1.length);
                    b1 = b2 = '';
                } else if ((!~io1 && ~io2) || (~io1 && ~io2 && io1 >= io2)) {
                    i1 += process(d2, d1, i2, i1, io2, b2.length);
                    b1 = b2 = '';
                }
            }
            i1 += 1;
            i2 += 1;
        }
        if (b1) push(d1, ustr1.length - b1.length, ustr1.length);
        if (b2) push(d2, ustr2.length - b2.length, ustr2.length);
  
        if (!checkDiff(d1) || !checkDiff(d2)) {
            throw new Error('Unexpected differences image');
        }
        return [
            { value: str1, diff: d1 },
            { value: str2, diff: d2 }
        ];
    }
    
    // understands that a diff is valid or not
    function checkDiff(diff) {
        let diffSorted = diff.slice().sort((d1, d2) => d1 - d2);
        for (let i = 0; i !== diff.length; i += 1) {
            if (diff[i] !== diffSorted[i]) {
                return false;
            }
        }
        return true;
    }
    
    /*
     * Get differences between several strings
     *
     * @param {Array<string>} strs
     * @param {object} opts
     * @return {Array<object>|object}
     */
    function byList(strs, opts = null) {
        let options = getOptions(opts);
        
        let tasks = createTasks(strs);
        let pairs = computePairs(tasks, options);
        let list = reduceDiff(collectFlat(pairs));
        
        // collect and return the result
        if (options.detailed) {
            return { pairs, list, length: strs.length };
        } else {
            return list.map(str => {
                return { value: str.value, diff: str.diff }; 
            });
        }
    }
    
    // creates list of tasks from list of strings
    function createTasks(strs) {
        let tasks = [];
        for (let i = 0; i !== strs.length - 1; i += 1) {
            for (let j = i + 1; j !== strs.length; j += 1) {
                tasks.push([
                    { id: i, value: strs[i] },
                    { id: j, value: strs[j] }
                ]);
            }
        }
        return tasks;
    }
    
    // computes differences for each pair presented in tasks
    function computePairs(tasks, options) {
        return tasks.map(task => 
            byPair(task[0].value, task[1].value, options).map((str, i) => 
                Object.assign({ id: task[i].id }, str)));
    }
    
    // collects list of pairs to list of strings and reduces all differences
    function collectFlat(pairs) {
        return Object.values(pairs.reduce((all, pair) => all.concat(pair), []).reduce((listObj, str) => {
            (listObj[str.id] = listObj[str.id] || {
                id: str.id, value: str.value, diffAll: []
            }).diffAll.push(str.diff);
            return listObj;
        }, {})).sort((s1, s2) => s1.id - s2.id);
    }
    
    // reduces differencies for list of strings
    function reduceDiff(list) {
        return list.map(str => Object.assign({
            diff: mergeDiff(str.diffAll)
        }, str));
    }
    
    // merges differencies for a string
    function mergeDiff(diffAll) {
        let mask = Array.from(Array(
            diffAll.reduce((max, diff) => Math.max(max, diff.length ? diff[diff.length - 1] : 0), 0)
        )).map(e => false);
        diffAll.forEach(diff => {
            for (let i = 0; i !== diff.length; i += 2) {
                for (let j = diff[i]; j !== diff[i + 1]; j += 1) {
                    mask[j] = true;
                }
            }
        });
        let diffRet = [], exist = true;
        for (let i = 0; i != mask.length; i += 1) {
            if ((mask[i] && exist) || (!mask[i] && !exist)) {
                diffRet.push(i);
                exist = !exist;
            }
        }
        if (!exist) diffRet.push(mask.length);
        return diffRet;
    }
    
    
    // the module exports
    let striffer = { VERSION, byPair, byList };
    
    // define the module as AMD, commonJS or global
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return striffer;
        });
    } else if (typeof exports !== 'undefined') {
        exports = module.exports = striffer;
    } else {
        this.striffer = striffer;
    }
    
}).call(this);