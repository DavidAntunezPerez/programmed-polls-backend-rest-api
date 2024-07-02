import { Timestamp } from 'firebase-admin/firestore'
import { Instance } from '../models/dataInterfaces'
import { db } from '../config/firebaseConfig'

export async function createInstance(
  pollId: string,
  duration: number,
  startTime: Timestamp,
) {
  const endTime = Timestamp.fromDate(
    new Date(startTime.toDate().getTime() + duration * 24 * 60 * 60 * 1000),
  )

  const newInstance: Instance = {
    pollId,
    startTime,
    endTime,
  }

  const instanceRef = await db.collection('instances').add(newInstance)
  return instanceRef.id
}
