import { db } from '../../config/firebaseConfig'
import { Timestamp } from 'firebase-admin/firestore'
import { Instance } from '../../models/dataInterfaces'
import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const pollsSnapshot = await db
          .collection('polls')
          .where('isEnabled', '==', true)
          .get()
        const currentTimestamp = Timestamp.now()

        for (const pollDoc of pollsSnapshot.docs) {
          const pollData = pollDoc.data()
          const lastInstanceSnapshot = await db
            .collection('instances')
            .where('pollId', '==', pollDoc.id)
            .orderBy('startTime', 'desc')
            .limit(1)
            .get()

          let createNewInstance = false

          // If poll is not scheduled yet, dont create instance
          if (pollData.startTime > currentTimestamp) {
            continue
          }

          if (lastInstanceSnapshot.empty) {
            createNewInstance = true
          } else {
            const lastInstance = lastInstanceSnapshot.docs[0].data()
            const nextInstanceTime = Timestamp.fromDate(
              new Date(
                lastInstance.startTime.toDate().getTime() +
                  pollData.frequency * 24 * 60 * 60 * 1000,
              ),
            )
            if (currentTimestamp >= nextInstanceTime) {
              createNewInstance = true
            }
          }

          if (createNewInstance) {
            await createInstance(pollDoc.id, pollData.duration)
          }
        }

        return res
          .status(200)
          .json({ message: 'Instances refreshed successfully' })
      } catch (error) {
        console.error('Error creating instances:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function createInstance(pollId: string, duration: number) {
  /**
   * // TODO: Start time does not have always to be NOW,
   * sometimes instance should have existed 2 days ago, endpoint could be called Monday at 20:00 PM but startTime of the poll can be every week Monday 17:30 PM,
   *  so instance should be created with startTime at 17:30 PM.
   */
  const startTime = Timestamp.now()
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
