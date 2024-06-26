import { Timestamp } from 'firebase-admin/firestore'

//* Polls
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

//* Instances

export interface Instance {
  startTime: Timestamp
  endTime: Timestamp
  pollId: string
}

// User Votes are a subcollection of the Instances collection
export interface UserVote {
  userId: string
  votes: boolean[]
  notes?: string
}
