export interface Validator {
  (value: any): boolean
}

export const isString: Validator = value => typeof value === 'string'
export const isNumber: Validator = value => typeof value === 'number'
export const isBoolean: Validator = value => typeof value === 'boolean'
export const isArray: Validator = value => Array.isArray(value)
export const isDate: Validator = value => !isNaN(Date.parse(value))

export const validators: { [key: string]: Validator } = {
  string: isString,
  number: isNumber,
  boolean: isBoolean,
  array: isArray,
  date: isDate,
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}
