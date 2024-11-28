import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Listener } from '../../types/listener';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // POST request - Create Listener
  if (req.method === 'POST') {
    try {
      const listenerData = req.body as Partial<Listener>;

      // Make the actual API call to your backend
      const response = await fetch('http://your-backend-url/api/listeners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you need
        },
        body: JSON.stringify(listenerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create listener');
      }

      return res.status(201).json({
        success: true,
        data: data as Listener
      });

    } catch (error) {
      console.error('Error creating listener:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create listener'
      });
    }
  }

  // GET request - Fetch Listeners
  if (req.method === 'GET') {
    try {
      // Make the actual API call to your backend
      const response = await fetch('http://your-backend-url/api/listeners', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you need
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch listeners');
      }

      // Ensure we're returning an array of Listeners
      return res.status(200).json({
        success: true,
        data: data as Listener[] // This should be an array of Listener objects
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch listeners'
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}