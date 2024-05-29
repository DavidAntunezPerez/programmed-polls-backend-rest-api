import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // If the request is different from a POST, return a 405 error
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // TODO: Using the request body, update Firebase to add a new vote in votes collection, adding the vote result and timestamp

  return res.status(200).json({
    message: 'Vote now',
  })
}
