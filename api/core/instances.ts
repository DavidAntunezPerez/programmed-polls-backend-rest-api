import { db } from '../../config/firebaseConfig'
import { Timestamp } from 'firebase-admin/firestore'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { createInstance } from '../../utils/createInstance'

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
          let newInstanceStartTime: Timestamp

          // If poll is not scheduled yet, don't create instance
          if (pollData.startTime > currentTimestamp) {
            continue
          }

          const pollStartDate = pollData.startTime.toDate()
          const pollStartTime = new Date(
            pollStartDate.getFullYear(),
            pollStartDate.getMonth(),
            pollStartDate.getDate(),
            pollStartDate.getHours(),
            pollStartDate.getMinutes(),
          )

          if (lastInstanceSnapshot.empty) {
            // No previous instances, create the first one
            createNewInstance = true

            // Set the first instance start time to the poll's start time
            newInstanceStartTime = Timestamp.fromDate(pollStartTime)

            // Create instances in a loop until we reach the current time
            while (currentTimestamp >= newInstanceStartTime) {
              await createInstance(
                pollDoc.id,
                pollData.duration,
                newInstanceStartTime,
              )

              // Move to the next instance time
              newInstanceStartTime = Timestamp.fromDate(
                new Date(
                  newInstanceStartTime.toDate().getTime() +
                    pollData.frequency * 24 * 60 * 60 * 1000,
                ),
              )
            }
          } else {
            const lastInstance = lastInstanceSnapshot.docs[0].data()
            let nextInstanceTime = Timestamp.fromDate(
              new Date(
                lastInstance.startTime.toDate().getTime() +
                  pollData.frequency * 24 * 60 * 60 * 1000,
              ),
            )
            while (currentTimestamp >= nextInstanceTime) {
              createNewInstance = true
              newInstanceStartTime = nextInstanceTime

              // Create instance for the calculated nextInstanceTime
              await createInstance(
                pollDoc.id,
                pollData.duration,
                newInstanceStartTime,
              )

              // Move to the next instance time
              nextInstanceTime = Timestamp.fromDate(
                new Date(
                  nextInstanceTime.toDate().getTime() +
                    pollData.frequency * 24 * 60 * 60 * 1000,
                ),
              )
            }
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
