import { create } from 'zustand';
import type { AuthState } from './models';

const useAuthState = create<AuthState>(() => ({
  is: `idle`,
}));

export { useAuthState };
