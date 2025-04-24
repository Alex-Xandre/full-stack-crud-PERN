import { create } from 'zustand';
import { getUsers, saveUser, deleteUser } from '../api';
import { User } from '../types';

interface UserStore {
  users: User[];
  fetchUsers: () => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],

  fetchUsers: async () => {
    try {
      const users = await getUsers();
      set({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },

  saveUser: async (user) => {
    try {
      const savedUser = await saveUser(user);
      set((state) => {
        if (user.id) {
          // Update
          return { users: state.users.map((u) => (u.id === user.id ? savedUser : u)) };
        } else {
          // Add
          return { users: [...state.users, savedUser] };
        }
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  deleteUser: async (id) => {
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  },
}));
