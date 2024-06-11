import { Timestamp } from 'firebase-admin/firestore'

//  Polls
export default interface Poll {
  title: string
  description: string
  options: string[]
  frequency: number
  duration: number
  isEnabled: boolean
  createdAt: Timestamp
  userId: string
}
