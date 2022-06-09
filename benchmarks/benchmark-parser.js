'use strict'

const { Suite } = require('benchmark')
const parse = require('../lib/parse')

const suite = new Suite()

const testCases = [
  '*;q=0, identity;q=1',
  '*',
  'compress;q=0.5, gzip;q=1.0',
  'compress;q=0.5, gzip;q=1.0',
  'deflate;q=0.5, gzip;q=0.5',
  'deflate;q=0.5,identity; q=0.5',
  'deflate;q=1.0, *',
  'gzip, compress;q=0',
  'gzip, deflate, br',
  'gzip;q=0.8, deflate',
  'gzip;q=0.8, identity;q=0.5, *;q=0.3',
  'gzip;q=0',
  'gzip;q=0',
  'gzip;q=1, identity;q=0.5',
  'gzip;q=1.0, compress;q=0.5',
  'identity;q=0',
  'identity;q=1',
  'test,br',
  'white rabbit'
]

for (const benchCase of testCases) {
  suite.add(benchCase, function () {
    parse(benchCase)
  })
}
suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('Slowest is ' + this.filter('slowest').map('name'))
  })
  .run({ async: true })
