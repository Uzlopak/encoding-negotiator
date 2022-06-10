'use strict'

const assert = require('assert')
const negotiate = require('../lib/index').negotiate
const parse = require('../lib/parse')

const testCases = [
  ['gzip, , identity', ['deflate', 'gzip'], 'gzip'],
  ['identity;q=1', ['gzip', 'identity'], 'identity'],
  ['gzip;q=1, identity;q=0.5', ['gzip', 'deflate'], 'gzip'],
  ['gzip, identity;q=0.5', ['gzip', 'deflate'], 'gzip'],
  ['gzip, , identity', ['deflate', 'gzip'], 'gzip'],
  ['gzip', ['gzip', 'deflate'], 'gzip'],
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
  ['gzip;q=0.8, identity;q=0.5, *;q=0.3', ['deflate', 'gzip', 'br'], 'gzip'],
  [';qzip;q=1gzip', ['qzip'], 'qzip']
]

for (const [header, supportedEncodings, expected] of testCases) {
  assert.equal(negotiate(header, supportedEncodings), expected, `should return ${expected} when ${header} and ${supportedEncodings}`)
}

const testCasesParse = [
  ['identity;q=1', [['identity', 1]]],
  ['gzip;q=1, identity;q=0.5', [['gzip', 1], ['identity', 0.5]]],
  ['gzip;q=0.8, identity;q=0.5, *;q=0.3', [['gzip', 0.8], ['identity', 0.5], ['*', 0.3]]],
  ['qzip;q=0.8', [['qzip', 0.8]]],
  ['qz3ip;q=0.9', [['qz3ip', 0.9]]],
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
  [' ; gzip ; q=0.8', [['gzip', 0.8]]],
  ['iden tity;q=1', [['tity', 1]]],
  // non-standard
  [';qzip;q=abc', [['qzip', 0], ['abc', 1]]],
  ['iden tity;q = 1', [['tity', 1]]],
  ['iden tity;q = 1f', [['tity', 1]]],
  ['gzip;q=1, identity;q=0.f5', [['gzip', 1], ['identity', 0], ['f5', 1]]]
]

for (const [header, expected] of testCasesParse) {
  const result = []
  function parseMatch (enc, quality) {
    result.push([enc, quality])
  }
  parse(header, parseMatch)
  assert.deepEqual(expected, result, `should return ${expected} when ${header}`)
}
