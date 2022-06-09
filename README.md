# @fastify/encoding-negotiator
![Build Status](https://github.com/fastify/@fastify/encoding-negotiator/workflows/ci/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/encoding-negotiator.svg?style=flat)](https://www.npmjs.com/package/@fastify/encoding-negotiator)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A negotiator for the accept-encoding header

## Install

```
npm install @fastify/encoding-negotiator
```

## Usage

#### Example
```js
const encodingNegotiator = require('@fastify/encoding-negotiator');

encodingNegotiator.negotiate('compress;q=0.5, gzip;q=1.0', ['gzip', 'deflate', 'identity']); //returns gzip
```
## API
### negotiate(header, supportedEncodings)
Returns the most preferred encoding available in `supportedEncodings` The first 
element of the `supportedEncodings` array will be used in case of an asterisk.

header: The `accept-encoding` header.

supportedEncodings: An array of the supported encodings.

## License

[MIT](./LICENSE)
