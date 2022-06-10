'use strict'

const BEGIN = 0
const TOKEN = 1
const QUALITY = 2
const END = 3

function parse (header, processMatch) {
  if (!header) {
    return
  }

  let str = ''
  let quality = ''
  let state = BEGIN
  for (let i = 0, il = header.length; i < il; ++i) {
    const char = header[i]

    if (char === ' ' || char === '\t') {
      continue
    } else if (char === ';') {
      if (state === TOKEN) {
        state = QUALITY
      }
      continue
    } else if (char === ',') {
      if (state === TOKEN) {
        if (processMatch(str, 1)) {
          state = END
          break
        }
        state = BEGIN
        str = ''
      } else if (state === QUALITY) {
        if (processMatch(str, parseFloat(quality) || 0)) {
          state = END
          break
        }
        state = BEGIN
        str = ''
        quality = ''
      }
      continue
    } else if (state === QUALITY && (char === 'q' || char === '=')) {
      continue
    } else if (
      state === QUALITY &&
      (
        char === '.' ||
        char === '1' ||
        char === '0' ||
        char === '2' ||
        char === '3' ||
        char === '4' ||
        char === '5' ||
        char === '6' ||
        char === '7' ||
        char === '8' ||
        char === '9'
      )
    ) {
      quality += char
      continue
    } else if (state === BEGIN) {
      state = TOKEN
    }
    if (state === TOKEN) {
      if (str.length !== 0) {
        const prevChar = header[i - 1]
        if (prevChar === ' ' || prevChar === '\t') {
          str = ''
        }
      }
      str += char
    } else {
      if (processMatch(str, parseFloat(quality) || 0)) {
        state = END
        break
      }
      state = BEGIN
      str = char
      quality = ''
    }
  }

  if (state === TOKEN) {
    processMatch(str, 1)
  } else if (state === QUALITY) {
    processMatch(str, parseFloat(quality) || 0)
  }
}

module.exports = parse
