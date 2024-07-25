import { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../../config/firebaseConfig'
import type Poll from '../../../models/dataInterfaces'
import { pollEditDTO } from '../../../models/schemas'
import { validate } from '../../../utils/validation'
import authenticate from '../../../utils/auth/authenticate'
import { Timestamp } from 'firebase-admin/firestore'
import applyCors from '../../../utils/auth/corsMiddleware'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await new Promise(resolve => applyCors(req, res, resolve))
  await new Promise(resolve => authenticate(req, res, resolve))
  const { method, query, body } = req

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

        const pollData = pollDoc.data() as Poll

        // (Not necessary for GetByID) Ensure that the poll belongs to the authenticated user
        // if (pollData.userId !== userId) {
        //   return res.status(403).json({
        //     message: 'Forbidden, you do not have access to this poll',
        //   })
        // }

        const response = {
          pollId: id,
          title: pollData.title,
          description: pollData.description,
          options: pollData.options,
          frequency: pollData.frequency,
          duration: pollData.duration,
          isEnabled: pollData.isEnabled,
          startTime: pollData.startTime.toDate().toISOString(),
          createdAt: pollData.createdAt.toDate().toISOString(),
        }

        return res.status(200).json(response)
      } catch (error) {
        console.error('Error fetching poll:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    case 'PATCH':
      try {
        // Access the polls collection and get the document with the given ID
        const pollDoc = await db
          .collection('polls')
          .doc(id as string)
          .get()

        if (!pollDoc.exists) {
          return res.status(404).json({ message: 'Poll not found' })
        }

        const pollData = pollDoc.data() as Poll

        // Ensure that the poll belongs to the authenticated user
        if (pollData.userId !== userId) {
          return res.status(403).json({
            message: 'Forbidden, you do not have access to this poll',
          })
        }

        const { isValid, errors } = validate(body, pollEditDTO)
        if (!isValid) {
          return res.status(400).json({ message: 'Bad Request', errors })
        }

        // Extract the fields to update from the request body
        const {
          title,
          description,
          options,
          frequency,
          duration,
          isEnabled,
          startTime,
        } = body

        if (frequency < duration) {
          return res.status(400).json({
            message:
              'Bad Request: Frequency must be greater than or equal to duration',
          })
        }

        const parsedStartTime = body.startTime
          ? Timestamp.fromDate(new Date(body.startTime))
          : pollData.startTime

        // Create an object with the fields to update
        const updatedFields: Partial<Poll> = {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(options !== undefined && { options }),
          ...(frequency !== undefined && { frequency }),
          ...(duration !== undefined && { duration }),
          ...(isEnabled !== undefined && { isEnabled }),
          ...(startTime !== undefined && { startTime: parsedStartTime }),
        }

        // Check if no fields are provided to update
        if (Object.keys(updatedFields).length === 0) {
          return res
            .status(400)
            .json({ message: 'Bad Request: No fields provided to update' })
        }

        // Update the document with the new fields
        await db
          .collection('polls')
          .doc(id as string)
          .update(updatedFields)
        return res
          .status(200)
          .json({ message: 'Poll updated successfully', pollId: id })
      } catch (error) {
        console.error('Error updating poll:', error)
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

        const pollData = pollDoc.data() as Poll

        // Ensure that the poll belongs to the authenticated user
        if (pollData.userId !== userId) {
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
        console.error('Error deleting poll:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['DELETE', 'GET', 'PATCH'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
