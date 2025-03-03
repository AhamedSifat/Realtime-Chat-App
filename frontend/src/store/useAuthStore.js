import { create } from 'zustand';
import useAxios from '../lib/useAxios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:5000';

const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isSigningUp: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await useAxios.get('/auth/check');
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await useAxios.post('/auth/signup', formData);
      set({ authUser: res.data });
      toast.success("You've signed up successfully!");
      get().connectSocket();
    } catch (error) {
      console.log('Error in signup:', error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await useAxios.post('/auth/logout');
      set({ authUser: null });
      toast.success("You've logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.log('Error in logout:', error);
      toast.error('Failed to logout');
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await useAxios.post('/auth/login', formData);
      set({ authUser: res.data });
      toast.success("You've logged in successfully!");
      get().connectSocket();
    } catch (error) {
      console.log('Error in login:', error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await useAxios.put('/auth/update-profile', formData);
      set({ authUser: res.data });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.log('Error in updateProfile:', error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useAuthStore;
