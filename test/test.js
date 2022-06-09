'use strict'

const assert = require('assert')
const negotiate = require('../lib/index').negotiate
const parse = require('../lib/parse')

const testCases = [
  ['identity;q=1', ['gzip', 'identity'], 'identity'],
  ['gzip;q=1, identity;q=0.5', ['gzip', 'deflate'], 'gzip'],
  ['deflate;q=0.5,identity; q=0.5', ['gzip', 'deflate'], 'deflate'],
  ['deflate;q=0.5, gzip;q=0.5', ['gzip', 'deflate'], 'gzip'],
  ['deflate;q=0.5, gzip;q=0.5', ['deflate', 'gzip'], 'deflate'],
  ['*', ['gzip', 'deflate'], 'gzip'],
  ['deflate;q=1.0, *', ['gzip'], 'gzip'],
  ['test,br', ['br'], 'br'],
  ['gzip;q=0', [], null],
  ['gzip;q=0', ['gzip', 'identity'], null],
  ['white rabbit', ['gzip', 'identity'], null],
  [undefined, ['gzip', 'identity'], undefined],
  ['compress;q=0.5, gzip;q=1.0', ['gzip', 'compress'], 'gzip'],
  ['gzip;q=1.0, compress;q=0.5', ['compress', 'gzip'], 'gzip'],
  ['compress;q=0.5, gzip;q=1.0', ['compress'], 'compress'],
  ['  compress;q=0.5, gzip;q=1.0', ['compress'], 'compress'],
  ['gzip, deflate, br', ['br', 'gzip', 'deflate'], 'br'],
  ['*', ['br', 'gzip', 'deflate'], 'br'],
  ['*;q=0, identity;q=1', ['gzip', 'identity'], 'identity'],
  ['identity;q=0', ['identity'], null],
  ['gzip, compress;q=0', ['compress', 'gzip'], 'gzip'],
  ['gzip;q=0.8, deflate', ['gzip', 'deflate'], 'deflate'],
  ['gzip;q=0.8, identity;q=0.5, *;q=0.3', ['deflate', 'gzip', 'br'], 'gzip']
]

for (const [header, supportedEncodings, expected] of testCases) {
  assert.equal(negotiate(header, supportedEncodings), expected, `should return ${expected} when ${header} and ${supportedEncodings}`)
}

const testCasesParse = [
  ['identity;q=1', [['identity', 1]]],
  ['gzip;q=1, identity;q=0.5', [['gzip', 1], ['identity', 0.5]]],
  ['gzip;q=0.8, identity;q=0.5, *;q=0.3', [['gzip', 0.8], ['identity', 0.5], ['*', 0.3]]],
  ['qzip;q=0.8', [['qzip', 0.8]]],
  [undefined, []],
  ['', []],
  ['   ', []],
  [' , ', []],
  [' ,, ', []],
  [';qzip;q=0.8', [['qzip', 0.8]]],
  [' ;gzip;q=0.8', [['gzip', 0.8]]],
  [' ; gzip;q=0.8', [['gzip', 0.8]]],
  [' ; gzip ;q=0.8', [['gzip', 0.8]]],
  [' ; gzip; q=0.8', [['gzip', 0.8]]],
  [' ; gzip ; q=0.8', [['gzip', 0.8]]]
]

for (const [header, expected] of testCasesParse) {
  assert.deepEqual(parse(header), expected, `should return ${expected} when ${header}`)
}
