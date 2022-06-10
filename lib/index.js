'use strict'

const parse = require('./parse')

function negotiate (header, supportedEncodings) {
  if (!header || !Array.isArray(supportedEncodings)) {
    return undefined
  }

  if (supportedEncodings.length === 0) {
    return null
  }

  if (header === '*') {
    return supportedEncodings[0]
  }

  let preferredEncoding = null
  let preferredEncodingPriority = Infinity
  let preferredEncodingQuality = 0

  function processMatch (enc, quality) {
    if (quality === 0 || preferredEncodingQuality > quality) {
      return false
    }

    const encoding = (enc === '*' && supportedEncodings[0]) || enc
    const priority = supportedEncodings.indexOf(encoding)
    if (priority === -1) {
      return false
    }

    if (quality === 1 && priority === 0) {
      preferredEncoding = encoding
      return true
    } else if (preferredEncodingQuality < quality) {
      preferredEncoding = encoding
      preferredEncodingPriority = priority
      preferredEncodingQuality = quality
    } else if (preferredEncodingPriority > priority) {
      preferredEncoding = encoding
      preferredEncodingPriority = priority
      preferredEncodingQuality = quality
    }
    return false
  }

  parse(header, processMatch)

  return preferredEncoding
}

module.exports = negotiate
module.exports.default = negotiate
module.exports.negotiate = negotiate
