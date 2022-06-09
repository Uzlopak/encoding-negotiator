'use strict'

const encodingRE = /\s*?(?:([^,^\s;]+)\s*?(?:;q=(\d\.\d\d\d|\d\.\d\d|\d\.\d|\d))?)/g

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

  const matches = header.matchAll(encodingRE)

  for (const match of matches) {
    const encoding = (match[1] === '*' && supportedEncodings[0]) || match[1]
    const priority = supportedEncodings.indexOf(encoding)
    if (priority === -1) {
      continue
    }

    const quality = match[2] ? parseFloat(match[2]) : 1
    if (quality === 0 || preferredEncodingQuality > quality) {
      continue
    }

    if (
      preferredEncodingQuality < quality
    ) {
      preferredEncoding = encoding
      preferredEncodingPriority = priority
      preferredEncodingQuality = quality
    } else if (preferredEncodingPriority > priority) {
      preferredEncoding = encoding
      preferredEncodingPriority = priority
      preferredEncodingQuality = quality
    }
  }

  return preferredEncoding
}

module.exports = negotiate
module.exports.default = negotiate
module.exports.negotiate = negotiate
