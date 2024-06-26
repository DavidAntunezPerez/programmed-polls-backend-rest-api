import { validators } from './validators'

// Generic Schema base
export interface Schema {
  [key: string]: {
    type: keyof typeof validators
    required?: boolean
    itemsType?: keyof typeof validators
  }
}

// Polls
export const pollCreateDTO: Schema = {
  title: { type: 'string', required: true },
  description: { type: 'string', required: true },
  options: { type: 'array', required: true, itemsType: 'string' },
  frequency: { type: 'number', required: true },
  duration: { type: 'number', required: true },
  startTime: { type: 'date' },
}

export const pollEditDTO: Schema = {
  title: { type: 'string' },
  description: { type: 'string' },
  options: { type: 'array', itemsType: 'string' },
  frequency: { type: 'number' },
  duration: { type: 'number' },
  startTime: { type: 'date' },
  isEnabled: { type: 'boolean' },
}

// Vote

export const voteCreateDTO: Schema = {
  votes: { type: 'array', required: true, itemsType: 'boolean' },
  notes: { type: 'string' },
}
