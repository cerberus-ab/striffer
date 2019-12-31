# Strings Defferer
The package provides functions to find difference between pair or list of strings.

### Installation
Using npm:
```shell
npm i --save striffer
```

In a browser:
```javascript
<script src="dist/striffer.min.js"></script>
```

In Node.js:
```javascript
const striffer = require('striffer');
```

### Documentation
Returns differences between two strings:
> Array\<object\> function byPair(string str1, string str2, object options = null)

Returns differences between several strings in a list:
> Array\<object\> function byList(Array\<string\> strs, object options = null)

The return item object contains:
- `string` value - an original string
- `Array<number>` diff - the list with indices which frame the differences

### Options
- `number` greedyFactor, By default: 3
- `boolean` caseInsensitive, By default: false
- `boolean` detailed (*byList* only), By default: false
