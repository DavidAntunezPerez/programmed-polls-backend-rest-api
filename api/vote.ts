import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        // TODO: Using the request body, update Firebase to add a new vote in votes collection, adding the vote result and timestamp
        const { name = 'David' } = req.query
        const docRef = db.collection('votes').doc('vote')
        await docRef.set({
          message: `Voted by ${name}!`,
        })

        // Read the document from Firestore
        const doc = await docRef.get()
        if (doc.exists) {
          const data = doc.data()
          return res.json({
            message: `Successfully wrote and read from Firestore: ${data?.message}`,
          })
        }
        return res
          .status(201)
          .json({ message: 'Document created successfully' })
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    // If the request is different from the selected ones , return 405 error
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
