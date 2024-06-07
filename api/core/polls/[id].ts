import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req
  const { id } = query

  return res.status(200).json({ message: `Poll ID: ${id}` })
}
