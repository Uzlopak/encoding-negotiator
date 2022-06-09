'use strict'
const BEGIN = 0
const IN_TOKEN = 1
const IN_QUALITY = 2

function parse (header) {
  if (!header) {
    return []
  }

  let str = ''
  let quality = ''
  let state = BEGIN
  const result = []
  for (let i = 0, il = header.length; i < il; ++i) {
    const char = header[i]

    switch (char) {
      case ' ':
      case '\t':
        break
      case ';':
        if (state === IN_TOKEN) {
          state = IN_QUALITY
          break
        }
        // fall through
      case ',':
        if (state === IN_TOKEN) {
          result.push([str, 1])
          state = BEGIN
          str = ''
        } else if (state === IN_QUALITY) {
          const qualityNumber = parseFloat(quality);
          (qualityNumber !== 0) && result.push([str, qualityNumber])
          state = BEGIN
          str = ''
          quality = ''
        }
        break
      case 'q':
        if (state === IN_QUALITY) {
          break
        }
      // fall through
      case '=':
        if (state === IN_QUALITY) {
          break
        }
      // fall through
      case '.':
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (state === IN_QUALITY) {
          quality += char
          break
        }
      // fall through
      default:
        if (state === BEGIN) {
          state = IN_TOKEN
        }
        str += char
    }
  }

  if (state === IN_TOKEN) {
    result.push([str, 1])
  } else if (state === IN_QUALITY) {
    result.push([str, parseFloat(quality)])
  }
  return result
}

module.exports = parse
