import { Timestamp } from 'firebase-admin/firestore'

//  Polls
export default interface Poll {
  title: string
  description: string
  options: string[]
  frequency: number
  duration: number
  startTime: Timestamp
  isEnabled: boolean
  createdAt: Timestamp
  userId: string
}
