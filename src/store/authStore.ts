import { create } from 'zustand';

interface AuthStore {
  // 상태 값들
  isAuthenticated: boolean;
  accessToken: string | null;
  isUserTypeLoading: boolean;
  isAutoLoginLoading: boolean;
  userId: string | null;
  group: string[]; // 그룹 정보 (예: 모임 ID 등)

  // 액션들
  setAutoLogin: (
    isAuthenticated: boolean,
    isAutoLoginLoading: boolean,
    accessToken: string | null,

    userId: string | null,
  ) => void;

  setLogin: (isAuthenticated: boolean) => void;

  setLogout: (
    isAuthenticated: boolean,
    accessToken: string | null,

    userId: string | null,
  ) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  userType: null,
  isUserTypeLoading: false,
  isAutoLoginLoading: false,
  userId: null,
  group: [],

  setAutoLogin: (isAuthenticated, isAutoLoginLoading, accessToken, userId) => {
    set({ isAuthenticated, isAutoLoginLoading, accessToken, userId });
  },

  setLogin: (isAuthenticated) => {
    set({ isAuthenticated });
  },

  setLogout: (isAuthenticated, accessToken, userId) => {
    set({ isAuthenticated, accessToken, userId });
  },
}));

export default useAuthStore;
