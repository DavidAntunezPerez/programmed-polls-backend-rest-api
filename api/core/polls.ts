import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../config/firebaseConfig'
import { Timestamp } from 'firebase-admin/firestore'
import type Poll from '../../models/dataInterfaces'
import { pollCreateDTO } from '../../models/schemas'
import { validate } from '../../utils/validation'
import authenticate from '../../utils//auth/authenticate'
import { createInstance } from '../../utils/createInstance'
import applyCors from '../../utils/auth/corsMiddleware'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply authentication middleware
  await new Promise(resolve => applyCors(req, res, resolve))
  await new Promise(resolve => authenticate(req, res, resolve))
  const { method, body } = req

  // Get userId from the authenticated user
  const userId = (req as any).user.uid

  switch (method) {
    case 'POST':
      try {
        const { isValid, errors } = validate(body, pollCreateDTO)
        if (!isValid) {
          return res.status(400).json({ message: 'Bad Request', errors })
        }

        // Validating the request body
        const { title, description, options, frequency, duration } =
          body as Poll
        if (
          !title ||
          !description ||
          !Array.isArray(options) ||
          typeof frequency !== 'number' ||
          typeof duration !== 'number'
        ) {
          return res.status(400).json({
            message: 'Bad Request: Missing or invalid fields in request body',
          })
        }

        if (frequency < duration) {
          return res.status(400).json({
            message:
              'Bad Request: Frequency must be greater than or equal to duration',
          })
        }

        // Use Timestamp.now() if startTime is not provided
        const parsedStartTime = body.startTime
          ? Timestamp.fromDate(new Date(body.startTime))
          : Timestamp.now()

        // Creating a new document in Firestore collection polls
        const newPoll: Poll = {
          title,
          description,
          options,
          frequency,
          duration,
          startTime: parsedStartTime,
          isEnabled: true,
          createdAt: Timestamp.now(),
          userId,
        }

        const pollRef = await db.collection('polls').add(newPoll)

        // Check if startTime is now or in the future
        const currentTime = Timestamp.now()
        const timeDiff = parsedStartTime.toMillis() - currentTime.toMillis()

        // If startTime is set for now, create the instance already so users can start voting
        if (timeDiff <= 0) {
          await createInstance(pollRef.id, duration, parsedStartTime)
        }

        return res
          .status(201)
          .json({ message: 'Poll created successfully', pollId: pollRef.id })
      } catch (error) {
        console.error('Error creating poll:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    case 'GET':
      try {
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
          const { userId, createdAt, startTime, ...data } = doc.data() as Poll
          return {
            pollId: doc.id,
            ...data,
            startTime: startTime.toDate().toISOString(),
            createdAt: createdAt.toDate().toISOString(),
          }
        })

        return res.status(200).json(polls)
      } catch (error) {
        console.error('Error fetching polls:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
