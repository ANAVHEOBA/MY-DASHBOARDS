import { AxiosError } from 'axios';

// Export the interface
export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

export const handleError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        // Handle forbidden
        break;
      case 404:
        // Handle not found
        break;
      case 500:
        // Handle server error
        break;
      default:
        // Handle other errors
    }

    const errorMessage = error.response.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject(new Error('No response from server'));
  } else {
    // Something happened in setting up the request that triggered an Error
    return Promise.reject(new Error(error.message || 'Error setting up request'));
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isAxiosError = <T = any>(error: unknown): error is AxiosError<T> => {
  return (error as AxiosError).isAxiosError === true;
};

export const extractErrorMessage = (error: unknown): string => {
  if (isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return getErrorMessage(error);
};