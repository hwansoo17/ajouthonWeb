// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean; // 인증 상태 확인 중인지 여부 (앱 초기 로드 시)

  initializeAuth: () => void;
  login: (token: string) => void; // userId 파라미터 제거
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  isLoading: true,
  groups: [], // 그룹 정보를 저장할 상태 추가

  initializeAuth: () => {
    console.log('[AuthStore] initializeAuth: 인증 상태 초기화 시도');
    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        // 중요: 실제 프로덕션에서는 여기서 토큰의 유효성을 서버에 확인해야 합니다.
        console.log(
          '[AuthStore] initializeAuth: 저장된 토큰 발견. 로그인 상태로 설정.',
        );
        set({
          isAuthenticated: true,
          accessToken: token,
          isLoading: false,
        });
      } else {
        console.log(
          '[AuthStore] initializeAuth: 저장된 토큰 없음. 로그아웃 상태로 설정.',
        );
        set({
          isAuthenticated: false,
          accessToken: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('[AuthStore] initializeAuth: 초기화 중 오류 발생', error);
      set({
        isAuthenticated: false,
        accessToken: null,
        isLoading: false,
      });
    }
  },

  login: (token: string) => {
    // userId 파라미터 제거
    console.log('[AuthStore] login: 로그인 처리 (token만 사용)');
    localStorage.setItem('accessToken', token);
    set({
      isAuthenticated: true,
      accessToken: token,
      isLoading: false,
    });
  },

  logout: () => {
    console.log('[AuthStore] logout: 로그아웃 처리');
    localStorage.removeItem('accessToken');
    set({
      isAuthenticated: false,
      accessToken: null,
      isLoading: false,
    });
  },

  setGroups: (groups) => {
    set({ groups });
  },
}));

export default useAuthStore;
