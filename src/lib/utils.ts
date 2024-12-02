import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Add this to your existing utils.ts file
// or create a new file if you prefer to keep it separate

const RETRY_COUNT = 3;
const RETRY_DELAY = 2000; // 2 seconds

export async function fetchWithRetry(url: string, options: RequestInit = {}) {
  let lastError;
  
  for (let i = 0; i < RETRY_COUNT; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed. Retrying...`);
      lastError = error;
      
      if (i < RETRY_COUNT - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  throw lastError;
}