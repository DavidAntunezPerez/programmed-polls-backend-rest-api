import { db } from '../../../config/firebaseConfig'
import { Timestamp } from 'firebase-admin/firestore'
import { VercelRequest, VercelResponse } from '@vercel/node'
import Poll, { Instance, UserVote } from '../../../models/dataInterfaces'
import authenticate from '../../../utils/auth/authenticate'
import { validate } from '../../../utils/validation'
import { voteCreateDTO } from '../../../models/schemas'
import applyCors from '../../../utils/auth/corsMiddleware'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await new Promise(resolve => applyCors(req, res, resolve))
  await new Promise(resolve => authenticate(req, res, resolve))

  const { method, query, body } = req
  const { id } = query
  const userId = (req as any).user.uid
  const { votes, notes } = body

  switch (method) {
    case 'POST':
      try {
        // Validate that body contains the required fields and that they are of the correct type
        const { isValid, errors } = validate(body, voteCreateDTO)
        if (!isValid) {
          return res.status(400).json({ message: 'Bad Request', errors })
        }

        // Access the polls collection and get the document with the given ID
        const pollDoc = await db
          .collection('polls')
          .doc(id as string)
          .get()

        if (!pollDoc.exists) {
          return res.status(404).json({ message: 'Poll not found' })
        }

        const pollData = pollDoc.data() as Poll

        // Ensure that the poll is enabled
        if (!pollData.isEnabled) {
          return res.status(400).json({ message: 'Poll has been disabled' })
        }

        // Validate that votes array length matches the number of poll options
        if (votes.length !== pollData.options.length) {
          return res.status(400).json({
            message: `Number of options voted must be exactly ${pollData.options.length}`,
          })
        }

        // Get the most recent instance for the given poll ID
        const instancesSnapshot = await db
          .collection('instances')
          .where('pollId', '==', id)
          .orderBy('startTime', 'desc')
          .limit(1)
          .get()

        if (instancesSnapshot.empty) {
          return res.status(404).json({
            message:
              'No votations open found for this poll, please try again later or contact an administrator.',
          })
        }

        const instanceDoc = instancesSnapshot.docs[0]
        const instanceData = instanceDoc.data() as Instance

        // Check if the instance is still active
        const currentTimestamp = Timestamp.now()
        if (currentTimestamp > instanceData.endTime) {
          return res
            .status(400)
            .json({ message: 'Voting period for this poll has ended' })
        }

        if (currentTimestamp < instanceData.startTime) {
          return res.status(400).json({
            message: 'Voting period for this poll has not started yet',
          })
        }

        // Check if the user has already voted in this instance
        const userVoteDoc = await db
          .collection('instances')
          .doc(instanceDoc.id)
          .collection('votes')
          .doc(userId)
          .get()

        if (userVoteDoc.exists) {
          return res
            .status(400)
            .json({ message: 'User has already voted in this instance' })
        }

        // Create the user's vote
        const newUserVote: UserVote = {
          userId,
          votes,
          notes: notes || null,
        }

        await db
          .collection('instances')
          .doc(instanceDoc.id)
          .collection('votes')
          .doc(userId)
          .set(newUserVote)

        return res.status(200).json({ message: 'Vote submitted successfully' })
      } catch (error) {
        console.error('Error submitting vote:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
