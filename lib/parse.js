'use strict'
const BEGIN = 0
const TOKEN = 1
const QUALITY = 2

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
        if (state === TOKEN) {
          state = QUALITY
          break
        }
        // fall through
      case ',':
        if (state === TOKEN) {
          result.push([str, 1])
          state = BEGIN
          str = ''
        } else if (state === QUALITY) {
          const qualityNumber = parseFloat(quality);
          (qualityNumber !== 0) && result.push([str, qualityNumber])
          state = BEGIN
          str = ''
          quality = ''
        }
        break
      case 'q':
        if (state === QUALITY) {
          break
        }
      // fall through
      case '=':
        if (state === QUALITY) {
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
        if (state === QUALITY) {
          quality += char
          break
        }
      // fall through
      default:
        if (state === BEGIN) {
          state = TOKEN
        }
        str += char
    }
  }

  if (state === TOKEN) {
    result.push([str, 1])
  } else if (state === QUALITY) {
    result.push([str, parseFloat(quality)])
  }
  return result
}

module.exports = parse
