import { describe, expect, it } from 'vitest'
import { calculateAge } from './age'
import { toCamelCase, toConstantCase, toKebabCase, toPascalCase, toSnakeCase, toTitleCase } from './caseConvert'
import { processJson } from './json'
import { buildCharset, generatePassword } from './password'
import { isWhatPercent, percentOf, percentageChange } from './percentage'
import { countText } from './wordCount'
import { convertUnit } from './units'

describe('case conversion', () => {
  it('converts common identifier styles', () => {
    expect(toCamelCase('Hello World')).toBe('helloWorld')
    expect(toPascalCase('hello-world')).toBe('HelloWorld')
    expect(toSnakeCase('Hello World')).toBe('hello_world')
    expect(toKebabCase('Hello World')).toBe('hello-world')
    expect(toConstantCase('Hello World')).toBe('HELLO_WORLD')
    expect(toTitleCase('hello world')).toBe('Hello World')
  })
})

describe('word count', () => {
  it('counts words, characters, and paragraphs', () => {
    const stats = countText('Hello world.\n\nThis is a test.')
    expect(stats.words).toBe(6)
    expect(stats.characters).toBe(29)
    expect(stats.paragraphs).toBe(2)
    expect(stats.sentences).toBe(2)
  })
})

describe('json', () => {
  it('formats valid json and reports invalid json', () => {
    const ok = processJson('{"a":1}')
    expect(ok.ok).toBe(true)
    if (ok.ok) {
      expect(ok.formatted).toContain('\n')
      expect(ok.minified).toBe('{"a":1}')
    }
    const bad = processJson('{a:1}')
    expect(bad.ok).toBe(false)
  })
})

describe('percentage', () => {
  it('calculates percent of, is-what-percent, and change', () => {
    expect(percentOf(10, 250)).toBe(25)
    expect(isWhatPercent(25, 200)).toBe(12.5)
    expect(percentageChange(100, 120)).toBe(20)
  })
})

describe('age', () => {
  it('returns calendar-accurate age', () => {
    const result = calculateAge(new Date(2000, 0, 15), new Date(2026, 0, 15))
    expect(result?.years).toBe(26)
    expect(result?.months).toBe(0)
    expect(result?.days).toBe(0)
    expect(result?.daysUntilBirthday).toBe(0)
  })
})

describe('units', () => {
  it('converts length, temperature, and data', () => {
    expect(convertUnit('length', 1, 'km', 'm')).toBe(1000)
    expect(convertUnit('temperature', 32, 'f', 'c')).toBe(0)
    expect(convertUnit('data', 1, 'kib', 'b')).toBe(1024)
  })
})

describe('password', () => {
  it('builds a charset and generates the requested length', () => {
    const charset = buildCharset({
      length: 16,
      lowercase: true,
      uppercase: false,
      numbers: false,
      symbols: false,
      excludeAmbiguous: false,
    })
    expect(charset).toBe('abcdefghijklmnopqrstuvwxyz')
    const password = generatePassword({
      length: 20,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true,
    })
    expect(password).toHaveLength(20)
    expect(/[Il1O0o]/.test(password)).toBe(false)
  })
})
