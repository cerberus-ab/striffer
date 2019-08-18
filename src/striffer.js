;(function() {
    
    // meta
    const VERSION = '0.1.0';
    
    // defaults
    const DEFAULT_SETTINGS = {
        greedyFactor: 3,
        maxStrings: 10,
        caseInsensitive: false,
        diffThreshold: 100
    }
    
    // helpers
    const getOptions = opts => Object.assign({}, DEFAULT_SETTINGS, typeof opts === 'object' && opts || {});
    
    /*
     * Get differences between two strings
     *
     * @param {string} str1
     * @param {string} str2
     * @param {object} options
     * @return {Array<object>} opts
     */
    function byPair(str1, str2, opts = null) {
        let options = getOptions(opts);

        let ustr1 = options.caseInsensitive ? str1.toLowerCase() : str1;
        let ustr2 = options.caseInsensitive ? str2.toLowerCase() : str2;
        
        let ind1 = [], b1 = '', i1 = 0, s1 = '';
        let ind2 = [], b2 = '', i2 = 0, s2 = '';
  
        const find = (str, trg) => trg ? str.indexOf(trg) : -1;
        
        const process = (ind_r1, ind_r2, i1, i2, io, blen) => {
            push(ind_r1, 1 + i1 - blen, 1 + i1 - options.greedyFactor);
            if (io) push(ind_r2, 1 + i2 - blen, 1 + i2 + io - blen);
            return options.greedyFactor + io - blen;
        };
  
        const push = (ind_r, beg, end) => {
            ind_r.push(beg);
            ind_r.push(end);
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
                    i2 += process(ind1, ind2, i1, i2, io1, b1.length);
                    b1 = b2 = '';
                } else if ((!~io1 && ~io2) || (~io1 && ~io2 && io1 >= io2)) {
                    i1 += process(ind2, ind1, i2, i1, io2, b2.length);
                    b1 = b2 = '';
                }
            }
            i1 += 1;
            i2 += 1;
        }
        if (b1) push(ind1, ustr1.length - b1.length, ustr1.length);
        if (b2) push(ind2, ustr2.length - b2.length, ustr2.length);
  
        return [
            { value: str1, diff: ind1 },
            { value: str2, diff: ind2 }
        ];
    }
    
    function byList(strs, options = DEFAULT_SETTINGS) {
        throw new Error('Is not implemented yet');
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