const BASE_URL = 'https://tt25.tharusha.dev/api';

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

export interface Service {
  id: string;
  name: string;
  description: string;
  departmentId: string | null;
  operationalHours?: OperationalHours;
  requiredDocuments?: RequiredDocuments;
}

export interface OperationalHours {
  [day: string]: string[];
}

export interface RequiredDocuments {
  other: string[];
  usual: {
    [document: string]: boolean;
  };
}

export interface Slot {
  time: string;
  currentQueueSize: number;
  maxCapacity: number;
  isAvailable: boolean;
}

export interface Department {
  id: string;
  departmentName: string;
  city: string;
  services: {
    serviceId: string;
    serviceName: string;
  }[];
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

  getServices: async (): Promise<Service[]> => {
    const response = await fetch(`${BASE_URL}/services`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch services');
    }
    return response.json();
  },

  getDepartments: async (): Promise<Department[]> => {
    const response = await fetch(`${BASE_URL}/departments`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch departments');
    }
    return response.json();
  },

  getServiceById: async (id: string): Promise<Service> => {
    const response = await fetch(`${BASE_URL}/services/${id}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch service details');
    }
    return response.json();
  },

  getSlotsForService: async (serviceId: string, date: string): Promise<Slot[]> => {
    const response = await fetch(`${BASE_URL}/appointments/${serviceId}/slots?date=${date}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch slots');
    }
    return response.json();
  },
};