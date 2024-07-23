import { db } from '../../../config/firebaseConfig'
import { VercelRequest, VercelResponse } from '@vercel/node'
import Poll, { Instance, UserVote } from '../../../models/dataInterfaces'
import authenticate from '../../../utils/auth/authenticate'
import getMailFromUid from '../../../utils/auth/getMailFromUid'
import applyCors from '../../../utils/auth/corsMiddleware'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await new Promise(resolve => applyCors(req, res, resolve))
  await new Promise(resolve => authenticate(req, res, resolve))

  const { method, query } = req
  const { id } = query
  const userId = (req as any).user.uid

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

        // Get the most recent instance for the given poll ID
        const instancesSnapshot = await db
          .collection('instances')
          .where('pollId', '==', id)
          .orderBy('startTime', 'desc')
          .limit(1)
          .get()

        if (instancesSnapshot.empty) {
          return res.status(404).json({
            message: 'No voting periods found for this poll',
          })
        }

        const instanceDoc = instancesSnapshot.docs[0]
        const instanceData = instanceDoc.data() as Instance

        // Initialize the response object
        const response: any = {
          pollTitle: pollData.title,
          pollDescription: pollData.description,
          startTime: instanceData.startTime.toDate(),
          endTime: instanceData.endTime.toDate(),
          optionCount: Array(pollData.options.length).fill(0),
          totalUsers: 0,
          totalVotes: 0,
        }

        const userVotesSnapshot = await db
          .collection('instances')
          .doc(instanceDoc.id)
          .collection('votes')
          .get()

        response.totalUsers = userVotesSnapshot.size

        // Initialize arrays for admin-specific data
        if (pollData.userId === userId) {
          response.usersVotes = pollData.options.map(option => ({
            optionName: option,
            userVotes: [],
          }))
          response.additionalNotes = []
        }

        // Count votes and collect admin-specific data if applicable
        for (const userVoteDoc of userVotesSnapshot.docs) {
          const userVoteData = userVoteDoc.data() as UserVote
          const userEmail = await getMailFromUid(userVoteData.userId)
          userVoteData.votes.forEach((vote, index) => {
            if (vote) {
              response.optionCount[index]++
              if (pollData.userId === userId) {
                response.usersVotes[index].userVotes.push(userEmail)
              }
            }
          })
          if (pollData.userId === userId && userVoteData.notes) {
            response.additionalNotes.push({
              user: userEmail,
              note: userVoteData.notes,
            })
          }
        }

        // Calculate total number of votes
        const sumTotalVotes: number = response.optionCount.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        )

        response.totalVotes = sumTotalVotes

        // Calculate completion rate
        response.completionRate = response.optionCount.map(
          count => count / response.totalVotes,
        )

        // Calculate voting period
        const votingPeriod =
          instanceData.endTime.toDate().getTime() -
          instanceData.startTime.toDate().getTime()
        const days = Math.floor(votingPeriod / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (votingPeriod % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor(
          (votingPeriod % (1000 * 60 * 60)) / (1000 * 60),
        )
        const seconds = Math.floor((votingPeriod % (1000 * 60)) / 1000)
        response.votingPeriod = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`

        return res.status(200).json(response)
      } catch (error) {
        console.error('Error fetching poll results:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: error.message })
      }

    default:
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
