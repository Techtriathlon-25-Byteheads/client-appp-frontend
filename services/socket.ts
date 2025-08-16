import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from 'socket.io-client';
import { Slot } from './api';

const SOCKET_URL = 'https://tt25.tharusha.dev';

let socket: Socket;

export interface AppointmentBookingData {
  departmentId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Connecting to socket with token:', token);

  if (!token) {
    throw new Error('No authentication token found');
  }
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const joinServiceQueue = (serviceId: string) => {
  if (socket) {
    socket.emit('join_service_queue', serviceId);
  }
};

export const bookAppointment = (data: AppointmentBookingData) => {
  if (socket) {
    socket.emit('book_appointment', data);
  }
};

export const onQueueUpdate = (callback: (data: { serviceId: string; slots: Slot[] }) => void) => {
  if (socket) {
    socket.on('queue_update', callback);
  }
};

export const onAppointmentBooked = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('appointment_booked', callback);
  }
};

export const onError = (callback: (error: any) => void) => {
  if (socket) {
    socket.on('error', callback);
  }
};
