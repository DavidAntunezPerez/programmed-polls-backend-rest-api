import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig'
import { Timestamp } from 'firebase-admin/firestore'
import authenticate from '../config/authenticate'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply authentication middleware
  await new Promise(resolve => authenticate(req, res, resolve))

  const { method, body, query } = req

  switch (method) {
    case 'POST':
      try {
        const { title, description, options, frequency, duration } = body
        // Get userId from the authenticated user
        const userId = (req as any).user.uid

        if (!title || !description || !options || !frequency || !duration) {
          return res
            .status(400)
            .json({ message: 'Bad Request: Missing fields in request body' })
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
        // Get userId from the authenticated user
        const userId = (req as any).user.uid

        // Filter by user to get polls related to him
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
