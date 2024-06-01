import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig' // Asegúrate de que esto apunta a tu configuración de Firestore
import { Timestamp } from 'firebase-admin/firestore'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req

  switch (method) {
    case 'POST':
      try {
        // Data validation
        const { title, description, options, frequency, duration, createdBy } =
          body

        if (
          !title ||
          !description ||
          !options ||
          !frequency ||
          !duration ||
          !createdBy
        ) {
          return res.status(400).json({
            message: 'Bad Request: Missing fields in request body',
          })
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
          createdBy,
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

    default:
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
