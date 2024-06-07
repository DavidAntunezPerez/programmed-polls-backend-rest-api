import { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../../config/firebaseConfig'
import authenticate from '../../../config/authenticate'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await new Promise(resolve => authenticate(req, res, resolve))
  const { method, query } = req

  // Get userId from the authenticated user and the poll ID
  const userId = (req as any).user.uid
  const { id } = query

  switch (method) {
    case 'GET':
      try {
        // Access the polls collection and get the document with the given ID
        const pollDoc = await db
          .collection('polls')
          .doc(id as string)
          .get()

        if (!pollDoc.exists) {
          return res.status(404).json({ message: 'Poll not found' })
        }

        const pollData = pollDoc.data()

        // Ensure that the poll belongs to the authenticated user
        if (pollData?.userId !== userId) {
          return res.status(403).json({
            message: 'Forbidden, you do not have access to this poll',
          })
        }

        const response = {
          duration: pollData?.duration,
          isEnabled: pollData?.isEnabled,
          options: pollData?.options,
          description: pollData?.description,
          title: pollData?.title,
          frequency: pollData?.frequency,
          createdAt: pollData?.createdAt.toDate().toISOString(),
        }

        return res.status(200).json(response)
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    case 'DELETE':
      try {
        // Access the polls collection and get the document with the given ID
        const pollDoc = await db
          .collection('polls')
          .doc(id as string)
          .get()

        if (!pollDoc.exists) {
          return res.status(404).json({ message: 'Poll not found' })
        }

        const pollData = pollDoc.data()

        // Ensure that the poll belongs to the authenticated user
        if (pollData?.userId !== userId) {
          return res.status(403).json({
            message: 'Forbidden, you do not have access to this poll',
          })
        }

        // Delete the poll with that doc ID
        await db
          .collection('polls')
          .doc(id as string)
          .delete()

        return res
          .status(200)
          .json({ message: `Poll with ID ${id} was deleted successfully` })
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['DELETE', 'GET', 'PATCH'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
