import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/services/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        // Handle GET request
        const users = []; // Get from your database
        return res.status(200).json(users);
      
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Users API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}