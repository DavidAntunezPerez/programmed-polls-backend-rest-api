import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req

  switch (method) {
    case 'POST':
      try {
        if (!body || !body.timestamp || !body.votes) {
          return res.status(400).json({
            message:
              'Bad Request: Missing timestamp or votes field in request body',
          })
        }

        const { timestamp, votes } = body
        const formattedTimestamp = new Date(timestamp)

        if (isNaN(formattedTimestamp.getTime())) {
          return res
            .status(400)
            .json({ message: 'Bad Request: Invalid timestamp format' })
        }

        // Convert to GMT+2
        const gmt2Offset = 2 * 60 * 60 * 1000
        const gmt2Timestamp = new Date(
          formattedTimestamp.getTime() + gmt2Offset,
        )

        const docRef = db.collection('votes').doc()
        await docRef.set({
          timestamp: gmt2Timestamp,
          votes: votes,
        })

        return res.status(201).json({ message: 'Vote recorded successfully' })
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
