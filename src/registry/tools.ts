import type { ComponentType } from 'react'
import {
  Binary,
  Calendar,
  CaseSensitive,
  Dices,
  FileJson,
  Hash,
  Image as ImageIcon,
  KeyRound,
  Percent,
  QrCode,
  Ruler,
  Type,
} from 'lucide-react'
import { AgeCalculatorTool } from '../tools/AgeCalculatorTool'
import { CaseConverterTool } from '../tools/CaseConverterTool'
import { ImageResizerTool } from '../tools/ImageResizerTool'
import { JsonFormatterTool } from '../tools/JsonFormatterTool'
import { PasswordGeneratorTool } from '../tools/PasswordGeneratorTool'
import { PercentageCalculatorTool } from '../tools/PercentageCalculatorTool'
import { QrCodeTool } from '../tools/QrCodeTool'
import { RandomNumberTool } from '../tools/RandomNumberTool'
import { UnitConverterTool } from '../tools/UnitConverterTool'
import { WordCounterTool } from '../tools/WordCounterTool'

export type ToolCategory = 'Generators' | 'Text' | 'Calculators' | 'Converters' | 'Images'

export type ToolDefinition = {
  slug: string
  name: string
  shortName: string
  description: string
  longDescription: string
  category: ToolCategory
  keywords: string[]
  icon: ComponentType<{ className?: string }>
  component: ComponentType
}

export const tools: ToolDefinition[] = [
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortName: 'QR Code',
    description: 'Turn any URL or text into a downloadable QR code.',
    longDescription:
      'Create QR codes from URLs, Wi-Fi strings, or any text. Customize size, colors, and error correction, then download a PNG — entirely in your browser.',
    category: 'Generators',
    keywords: ['qr', 'barcode', 'url', 'scan', 'png'],
    icon: QrCode,
    component: QrCodeTool,
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    shortName: 'Password',
    description: 'Generate strong random passwords with CSPRNG.',
    longDescription:
      'Build strong passwords with crypto.getRandomValues. Choose length, character sets, and exclude look-alike characters. Nothing is stored or sent.',
    category: 'Generators',
    keywords: ['password', 'secure', 'random', 'passphrase', 'crypto'],
    icon: KeyRound,
    component: PasswordGeneratorTool,
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    shortName: 'Word Count',
    description: 'Count words, characters, sentences, and reading time.',
    longDescription:
      'Paste any text to get live word, character, sentence, and paragraph counts plus estimated reading and speaking time.',
    category: 'Text',
    keywords: ['words', 'characters', 'reading time', 'sentences', 'essay'],
    icon: Type,
    component: WordCounterTool,
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    shortName: 'Case',
    description: 'Convert text between common letter cases.',
    longDescription:
      'Switch text to UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, or CONSTANT_CASE.',
    category: 'Text',
    keywords: ['uppercase', 'lowercase', 'camelcase', 'snake', 'kebab', 'title'],
    icon: CaseSensitive,
    component: CaseConverterTool,
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortName: 'JSON',
    description: 'Pretty-print, minify, and validate JSON locally.',
    longDescription:
      'Format, minify, and validate JSON with clear error messages. Useful for configs, API payloads, and debugging — no data leaves your device.',
    category: 'Text',
    keywords: ['json', 'pretty print', 'minify', 'validate', 'format'],
    icon: FileJson,
    component: JsonFormatterTool,
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortName: 'Percent',
    description: 'Solve percent-of, is-what-percent, and change.',
    longDescription:
      'Calculate what X% of Y is, what percent X is of Y, and percentage increase or decrease. Instant results, no spreadsheet required.',
    category: 'Calculators',
    keywords: ['percent', 'discount', 'increase', 'decrease', 'math'],
    icon: Percent,
    component: PercentageCalculatorTool,
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    shortName: 'Age',
    description: 'Get exact age in years, months, and days.',
    longDescription:
      'Enter a date of birth to see exact age, total days lived, and days until the next birthday. Optionally calculate age as of any date.',
    category: 'Calculators',
    keywords: ['age', 'birthday', 'dob', 'years', 'date'],
    icon: Calendar,
    component: AgeCalculatorTool,
  },
  {
    slug: 'random-number-generator',
    name: 'Random Number Generator',
    shortName: 'Random',
    description: 'Draw random numbers with optional uniqueness.',
    longDescription:
      'Generate one or many random numbers in a range. Choose integers or decimals, allow duplicates or unique draws, and copy the results.',
    category: 'Generators',
    keywords: ['random', 'rng', 'dice', 'lottery', 'integer'],
    icon: Dices,
    component: RandomNumberTool,
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    shortName: 'Units',
    description: 'Convert length, weight, temperature, and more.',
    longDescription:
      'Convert length, mass, temperature, volume, area, time, speed, and digital storage units. All conversions run locally with standard formulas.',
    category: 'Converters',
    keywords: ['units', 'metric', 'imperial', 'temperature', 'length', 'weight'],
    icon: Ruler,
    component: UnitConverterTool,
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    shortName: 'Images',
    description: 'Resize and compress images entirely in-browser.',
    longDescription:
      'Resize and compress JPG, PNG, or WebP images with the canvas API. Files never leave your device. Download the result when you are happy with the size.',
    category: 'Images',
    keywords: ['image', 'resize', 'compress', 'jpg', 'png', 'webp', 'canvas'],
    icon: ImageIcon,
    component: ImageResizerTool,
  },
]

export const categories: ToolCategory[] = ['Generators', 'Text', 'Calculators', 'Converters', 'Images']

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug)
}

export function searchTools(query: string): ToolDefinition[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return tools
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.shortName, tool.description, tool.category, ...tool.keywords]
      .join(' ')
      .toLowerCase()
    return haystack.includes(needle)
  })
}

export function relatedTools(slug: string, limit = 3): ToolDefinition[] {
  const current = getTool(slug)
  if (!current) return tools.slice(0, limit)
  return tools
    .filter((tool) => tool.slug !== slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, limit)
}

export const categoryIcons: Record<ToolCategory, ComponentType<{ className?: string }>> = {
  Generators: Hash,
  Text: Type,
  Calculators: Percent,
  Converters: Binary,
  Images: ImageIcon,
}
