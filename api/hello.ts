import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../config/firebaseConfig'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name = 'World' } = req.query;

  try {
    // Add a document to Firestore
    const docRef = db.collection('testCollection').doc('testDoc');
    await docRef.set({
      message: `Hello ${name}!`,
    });

    // Read the document from Firestore
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      return res.json({
        message: `Successfully wrote and read from Firestore: ${data?.message}`,
      });
    } else {
      return res.status(404).json({
        message: 'No such document!',
      });
    }
  } catch (error) {
    console.error('Error writing to Firestore', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}
