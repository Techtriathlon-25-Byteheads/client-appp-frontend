const BASE_URL = 'https://seminar-zoo-online-patrick.trycloudflare.com/api';

export interface LoginResponse {
  message: string;
  userId: string;
}

export interface VerifyOTPResponse {
  message: string;
  token: string;
}

export interface SignupRequest {
  fullName: string;
  nic: string;
  dob: string;
  address: {
    street: string;
    city: string;
  };
  contactNumber: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  login: async (nic: string, phone: string): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nic, phone }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Login failed');
    }

    return response.json();
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    try {
      console.log('Sending signup request:', JSON.stringify(data, null, 2));
      
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Signup response status:', response.status);
      const responseData = await response.text();
      console.log('Signup response:', responseData);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          responseData ? JSON.parse(responseData).message || 'Signup failed' : 'Signup failed'
        );
      }

      return JSON.parse(responseData);
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred during signup');
    }
  },

  verifyOTP: async (userId: string, otp: string): Promise<VerifyOTPResponse> => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otp }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'OTP verification failed');
    }

    return response.json();
  },
};
