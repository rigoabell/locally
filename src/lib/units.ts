export type Unit = {
  id: string
  label: string
  toBase: number
}

export type UnitCategory = {
  id: string
  label: string
  units: Unit[]
  defaultFrom: string
  defaultTo: string
  convert?: (value: number, from: string, to: string) => number
}

const length: Unit[] = [
  { id: 'nm', label: 'Nanometers (nm)', toBase: 1e-9 },
  { id: 'um', label: 'Micrometers (μm)', toBase: 1e-6 },
  { id: 'mm', label: 'Millimeters (mm)', toBase: 0.001 },
  { id: 'cm', label: 'Centimeters (cm)', toBase: 0.01 },
  { id: 'm', label: 'Meters (m)', toBase: 1 },
  { id: 'km', label: 'Kilometers (km)', toBase: 1000 },
  { id: 'in', label: 'Inches (in)', toBase: 0.0254 },
  { id: 'ft', label: 'Feet (ft)', toBase: 0.3048 },
  { id: 'yd', label: 'Yards (yd)', toBase: 0.9144 },
  { id: 'mi', label: 'Miles (mi)', toBase: 1609.344 },
  { id: 'nmi', label: 'Nautical miles (nmi)', toBase: 1852 },
]

const mass: Unit[] = [
  { id: 'mg', label: 'Milligrams (mg)', toBase: 0.000001 },
  { id: 'g', label: 'Grams (g)', toBase: 0.001 },
  { id: 'kg', label: 'Kilograms (kg)', toBase: 1 },
  { id: 't', label: 'Metric tons (t)', toBase: 1000 },
  { id: 'oz', label: 'Ounces (oz)', toBase: 0.028349523125 },
  { id: 'lb', label: 'Pounds (lb)', toBase: 0.45359237 },
  { id: 'st', label: 'Stone (st)', toBase: 6.35029318 },
]

const volume: Unit[] = [
  { id: 'ml', label: 'Milliliters (ml)', toBase: 0.001 },
  { id: 'l', label: 'Liters (l)', toBase: 1 },
  { id: 'm3', label: 'Cubic meters (m³)', toBase: 1000 },
  { id: 'tsp', label: 'Teaspoons (tsp)', toBase: 0.00492892159375 },
  { id: 'tbsp', label: 'Tablespoons (tbsp)', toBase: 0.01478676478125 },
  { id: 'floz', label: 'Fluid ounces (fl oz)', toBase: 0.0295735295625 },
  { id: 'cup', label: 'Cups (US)', toBase: 0.2365882365 },
  { id: 'pt', label: 'Pints (US)', toBase: 0.473176473 },
  { id: 'qt', label: 'Quarts (US)', toBase: 0.946352946 },
  { id: 'gal', label: 'Gallons (US)', toBase: 3.785411784 },
]

const area: Unit[] = [
  { id: 'mm2', label: 'Square millimeters (mm²)', toBase: 0.000001 },
  { id: 'cm2', label: 'Square centimeters (cm²)', toBase: 0.0001 },
  { id: 'm2', label: 'Square meters (m²)', toBase: 1 },
  { id: 'km2', label: 'Square kilometers (km²)', toBase: 1_000_000 },
  { id: 'in2', label: 'Square inches (in²)', toBase: 0.00064516 },
  { id: 'ft2', label: 'Square feet (ft²)', toBase: 0.09290304 },
  { id: 'yd2', label: 'Square yards (yd²)', toBase: 0.83612736 },
  { id: 'acre', label: 'Acres', toBase: 4046.8564224 },
  { id: 'ha', label: 'Hectares (ha)', toBase: 10_000 },
]

const time: Unit[] = [
  { id: 'ms', label: 'Milliseconds (ms)', toBase: 0.001 },
  { id: 's', label: 'Seconds (s)', toBase: 1 },
  { id: 'min', label: 'Minutes (min)', toBase: 60 },
  { id: 'h', label: 'Hours (h)', toBase: 3600 },
  { id: 'day', label: 'Days', toBase: 86400 },
  { id: 'week', label: 'Weeks', toBase: 604800 },
  { id: 'month', label: 'Months (avg)', toBase: 2_629_746 },
  { id: 'year', label: 'Years (avg)', toBase: 31_556_952 },
]

const speed: Unit[] = [
  { id: 'mps', label: 'Meters/second (m/s)', toBase: 1 },
  { id: 'kph', label: 'Kilometers/hour (km/h)', toBase: 1000 / 3600 },
  { id: 'mph', label: 'Miles/hour (mph)', toBase: 1609.344 / 3600 },
  { id: 'knot', label: 'Knots', toBase: 1852 / 3600 },
  { id: 'fps', label: 'Feet/second (ft/s)', toBase: 0.3048 },
]

const data: Unit[] = [
  { id: 'b', label: 'Bytes (B)', toBase: 1 },
  { id: 'kb', label: 'Kilobytes (KB)', toBase: 1000 },
  { id: 'kib', label: 'Kibibytes (KiB)', toBase: 1024 },
  { id: 'mb', label: 'Megabytes (MB)', toBase: 1_000_000 },
  { id: 'mib', label: 'Mebibytes (MiB)', toBase: 1024 ** 2 },
  { id: 'gb', label: 'Gigabytes (GB)', toBase: 1_000_000_000 },
  { id: 'gib', label: 'Gibibytes (GiB)', toBase: 1024 ** 3 },
  { id: 'tb', label: 'Terabytes (TB)', toBase: 1_000_000_000_000 },
  { id: 'tib', label: 'Tebibytes (TiB)', toBase: 1024 ** 4 },
]

function convertLinear(units: Unit[], value: number, from: string, to: string): number {
  const source = units.find((unit) => unit.id === from)
  const target = units.find((unit) => unit.id === to)
  if (!source || !target) throw new Error('Unknown unit.')
  return (value * source.toBase) / target.toBase
}

function toCelsius(value: number, from: string): number {
  if (from === 'c') return value
  if (from === 'f') return ((value - 32) * 5) / 9
  if (from === 'k') return value - 273.15
  throw new Error('Unknown temperature unit.')
}

function fromCelsius(value: number, to: string): number {
  if (to === 'c') return value
  if (to === 'f') return (value * 9) / 5 + 32
  if (to === 'k') return value + 273.15
  throw new Error('Unknown temperature unit.')
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  { id: 'length', label: 'Length', units: length, defaultFrom: 'm', defaultTo: 'ft' },
  { id: 'mass', label: 'Weight / Mass', units: mass, defaultFrom: 'kg', defaultTo: 'lb' },
  {
    id: 'temperature',
    label: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius (°C)', toBase: 1 },
      { id: 'f', label: 'Fahrenheit (°F)', toBase: 1 },
      { id: 'k', label: 'Kelvin (K)', toBase: 1 },
    ],
    defaultFrom: 'c',
    defaultTo: 'f',
    convert: (value, from, to) => fromCelsius(toCelsius(value, from), to),
  },
  { id: 'volume', label: 'Volume', units: volume, defaultFrom: 'l', defaultTo: 'gal' },
  { id: 'area', label: 'Area', units: area, defaultFrom: 'm2', defaultTo: 'ft2' },
  { id: 'time', label: 'Time', units: time, defaultFrom: 'h', defaultTo: 'min' },
  { id: 'speed', label: 'Speed', units: speed, defaultFrom: 'kph', defaultTo: 'mph' },
  { id: 'data', label: 'Digital storage', units: data, defaultFrom: 'mb', defaultTo: 'mib' },
]

export function convertUnit(categoryId: string, value: number, from: string, to: string): number {
  const category = UNIT_CATEGORIES.find((item) => item.id === categoryId)
  if (!category) throw new Error('Unknown category.')
  if (category.convert) return category.convert(value, from, to)
  return convertLinear(category.units, value, from, to)
}
