import type { NextApiRequest, NextApiResponse } from 'next';
import { UserMetrics } from '@/services/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const metrics: UserMetrics = {
      totalActive: 0,
      newToday: 0,
      currentlyOnline: 0,
      reportedIssues: 0
    };

    return res.status(200).json(metrics);
  } catch (error) {
    console.error('Metrics API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}