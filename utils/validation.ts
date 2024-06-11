import { Schema } from '../models/schemas'
import { ValidationResult, validators } from '../models/validators'

export const validate = (data: any, schema: Schema): ValidationResult => {
  const errors: string[] = []

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key]

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Missing required field: ${key}`)
      continue
    }

    if (value !== undefined && value !== null) {
      const validator = validators[rules.type]
      if (!validator(value)) {
        errors.push(`Invalid type for field: ${key}, expected ${rules.type}`)
      }

      if (rules.type === 'array' && rules.itemsType) {
        value.forEach((item: any, index: number) => {
          const itemValidator = validators[rules.itemsType!]
          if (!itemValidator(item)) {
            errors.push(
              `Invalid type for item at index ${index} in field: ${key}, expected ${rules.itemsType}`,
            )
          }
        })
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
