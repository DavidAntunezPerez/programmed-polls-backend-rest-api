import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig'
import { Timestamp } from 'firebase-admin/firestore'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body, query } = req

  switch (method) {
    case 'POST':
      try {
        // Data validation
        const { title, description, options, frequency, duration, userId } =
          body

        if (
          !title ||
          !description ||
          !options ||
          !frequency ||
          !duration ||
          !userId
        ) {
          return res.status(400).json({
            message: 'Bad Request: Missing fields in request body',
          })
        }

        // Validate that the user exists in Firestore
        const userRef = db.collection('users').doc(userId)
        const userDoc = await userRef.get()

        if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' })
        }

        // Creating a new document in Firestore collection polls
        const newPoll = {
          title,
          description,
          options,
          frequency,
          duration,
          isEnabled: true,
          createdAt: Timestamp.now(),
          userId,
        }

        const pollRef = await db.collection('polls').add(newPoll)
        return res
          .status(201)
          .json({ message: 'Poll created successfully', pollId: pollRef.id })
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    case 'GET':
      try {
        const { userId } = query

        if (!userId) {
          return res
            .status(400)
            .json({ message: 'Bad Request: Missing userId in query' })
        }

        const pollsSnapshot = await db
          .collection('polls')
          .where('userId', '==', userId)
          .get()

        if (pollsSnapshot.empty) {
          return res
            .status(404)
            .json({ message: 'No polls found for this user' })
        }

        const polls = pollsSnapshot.docs.map(doc => {
          const { userId, createdAt, ...data } = doc.data()
          return {
            pollId: doc.id,
            ...data,
            createdAt: createdAt.toDate().toISOString(),
          }
        })

        return res.status(200).json(polls)
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
