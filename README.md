hashed-release-name
===================
Generate a human readable release name based on a hash.

This project is based on the [project-name-generator](https://www.npmjs.com/package/project-name-generator) NPM module which unfortunately does not a random seed.


```javascript
var hrn = require('hashed-release-name');

console.log(hrn()); //= Something like 'fruity wombat'

console.log(hrn({aliterative: true})); //= Something like 'chalky clown'

console.log(hrn({hash: 123, aliterative: true})); //= Something like 'mushy mastadon' (but will ALWAYS return the same result unless the hash changes)
```


API
===
This module returns a single function which can be called as `([hash], [options])`.

Options is an object which can contain any of the below:

| Option               | Type                | Default                  | Description                                                                                                          |
|----------------------|---------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------|
| `hash`               | `string`            | `Date.now()`             | Alternate way to specify the hash                                                                                    |
| `alliterative`       | `boolean`           | `false`                  | boolean Generated name should be alliterative (e.g. 'wicked wombat')                                                 |
| `adjectives`         | `string` or `array` | `./data/adjectives.json` | A word list of adjectives, if this is a string the file path specified will be processed as JSON                     |
| `nouns`              | `string` or `array` | `./data/nouns.json`      | A word list of nouns, if this is a string the file path specified will be processed as JSON                          |
| `sampler`            | `function`          | (See code)               | Function called as `(list, settings)` to return a random choice from a word list                                     |
| `samplerAliterative` | `function`          | (See code)               | Function called as `(list, settings, firstChar)` to return a random choice from a word list, limited by alliteration |
| `mapper`             | `function`          | `word => word`           | Additional transforms to apply on a per-word basis to the output                                                     |
| `joiner`             | `string`            | `" "`                    | String sequence to join the generated terms by                                                                       |
| `transformer`        | `string` `          | phrase => phrase`        | Function to run the whole generated phrase though before returning                                                   |
