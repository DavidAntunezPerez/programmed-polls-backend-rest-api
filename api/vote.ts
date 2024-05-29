import { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        // TODO: Using the request body, update Firebase to add a new vote in votes collection, adding the vote result and timestamp
        const { name = 'World' } = req.body
        const docRef = db.collection('testCollection').doc('testDoc')
        await docRef.set({ message: `Hello ${name}!` })
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
