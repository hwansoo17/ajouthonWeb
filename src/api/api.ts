import axios from 'axios';

// 웹 환경에서는 process.env를 통해 환경 변수를 가져옵니다.
// Next.js의 경우 NEXT_PUBLIC_ 접두사가 필요합니다.
// Create React App의 경우 REACT_APP_ 접두사가 필요합니다.
const API_URL = process.env.SERVER_URL || 'http://localhost:8080/'; // 기본 URL 예시

// --- 토큰 저장/삭제 헬퍼 함수 (localStorage 사용) ---
const Storage = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token) => localStorage.setItem('accessToken', token),
  removeAccessToken: () => localStorage.removeItem('accessToken'),

  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
  removeRefreshToken: () => localStorage.removeItem('refreshToken'),

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// API 호출을 위한 axios 인스턴스 (로그인 전에 사용)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// refreshToken을 헤더에 삽입하여 사용하는 API (자동로그인, 토큰 재발급 시 사용)
export const refreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// refreshApi 요청 인터셉터: 요청 보내기 전에 refreshToken 헤더에 삽입
refreshApi.interceptors.request.use(
  (config) => {
    console.log(
      '[refreshApi Request Interceptor] 헤더에 리프레시 토큰 삽입 시도',
    );
    const refreshToken = Storage.getRefreshToken(); // localStorage에서 동기적으로 가져옴
    if (refreshToken) {
      console.log(
        '[refreshApi Request Interceptor] 리프레시 토큰 발견:',
        refreshToken.substring(0, 10) + '...',
      ); // 토큰 전체 로깅은 보안상 주의
      config.headers.Authorization = `Bearer ${refreshToken}`;
    } else {
      console.log('[refreshApi Request Interceptor] 저장된 리프레시 토큰 없음');
    }
    return config;
  },
  (error) => {
    console.error('[refreshApi Request Interceptor] 에러:', error);
    return Promise.reject(error);
  },
);

// refreshApi 응답 인터셉터 (특별한 로직 없이 응답 반환)
refreshApi.interceptors.response.use(
  (response) => {
    console.log('[refreshApi Response Interceptor] 응답 받음');
    return response;
  },
  (error) => {
    console.error(
      '[refreshApi Response Interceptor] 에러:',
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// 로그인 후, 모든 요청은 해당 API를 사용 (accessToken 사용)
export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  // HTTP-Only 쿠키를 사용하는 경우 (특히 refreshToken 관련)
  // withCredentials: true, // 필요에 따라 주석 해제 (서버 CORS 설정 필요)
});

// authApi 요청 인터셉터: 요청 보내기 전에 accessToken 헤더에 삽입
authApi.interceptors.request.use(
  (config) => {
    console.log('[authApi Request Interceptor] 헤더에 액세스 토큰 삽입 시도');
    const accessToken = Storage.getAccessToken(); // localStorage에서 동기적으로 가져옴
    if (accessToken) {
      console.log(
        '[authApi Request Interceptor] 액세스 토큰 발견:',
        accessToken.substring(0, 10) + '...',
      );
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log('[authApi Request Interceptor] 저장된 액세스 토큰 없음');
    }
    return config;
  },
  (error) => {
    console.error('[authApi Request Interceptor] 에러:', error);
    return Promise.reject(error);
  },
);

// authApi 응답 인터셉터: 토큰 만료(401) 시 재발급 로직
authApi.interceptors.response.use(
  (response) => {
    console.log('[authApi Response Interceptor] 응답 받음');
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 403 && !originalRequest._retry) {
      console.warn(
        '[authApi Response Interceptor] 401 에러 발생. 토큰 재발급 시도.',
      );
      originalRequest._retry = true; // 재시도 플래그 설정

      const currentRefreshToken = Storage.getRefreshToken();
      if (!currentRefreshToken) {
        console.error(
          '[authApi Response Interceptor] 리프레시 토큰이 없어 재발급 불가. 로그아웃 처리 필요.',
        );
        // 여기서 로그아웃 처리 로직을 호출할 수 있습니다. 예: useAuthStore().logout();
        // Storage.clearTokens();
        // window.location.href = '/login'; // 강제 페이지 이동
        return Promise.reject(new Error('No refresh token available.'));
      }

      try {
        console.log(
          '[authApi Response Interceptor] 리프레시 토큰으로 새 토큰 요청:',
          currentRefreshToken.substring(0, 10) + '...',
        );
        // refreshApi를 사용하여 토큰 재발급 요청 (refreshApi는 자체 인터셉터로 헤더에 refreshToken 삽입)
        const reissueResponse = await refreshApi.post('/token/re-issue'); // 서버의 토큰 재발급 엔드포인트

        if (reissueResponse.status === 200 || reissueResponse.status === 201) {
          const { accessToken, refreshToken: newRefreshToken } =
            reissueResponse.data; // 서버 응답 구조에 맞게 조정
          console.log(
            '[authApi Response Interceptor] 새 토큰 발급 성공:',
            accessToken.substring(0, 10) + '...',
          );

          Storage.setAccessToken(accessToken);
          if (newRefreshToken) {
            // 서버에서 새 리프레시 토큰을 줄 경우 업데이트
            Storage.setRefreshToken(newRefreshToken);
            console.log(
              '[authApi Response Interceptor] 새 리프레시 토큰 저장:',
              newRefreshToken.substring(0, 10) + '...',
            );
          }

          // 재시도하는 원래 요청의 헤더에 새 액세스 토큰 설정
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          // authApi 인스턴스의 기본 헤더도 업데이트 (선택 사항, 그러나 다음 요청부터 적용되도록)
          authApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          console.log('[authApi Response Interceptor] 원래 요청 재시도.');
          return authApi(originalRequest); // 원래 요청 재시도
        }
      } catch (reissueError: any) {
        console.error(
          '[authApi Response Interceptor] 토큰 재발급 실패:',
          reissueError.response?.data || reissueError.message,
        );
        // 리프레시 토큰도 만료되었거나 유효하지 않은 경우
        if (reissueError.response?.status === 401) {
          console.error(
            '[authApi Response Interceptor] 리프레시 토큰도 만료됨. 강제 로그아웃.',
          );
          // 여기서 로그아웃 처리 로직 (예: 스토어 상태 변경, 토큰 삭제, 로그인 페이지로 리다이렉트)
          Storage.clearTokens();
          // 웹에서는 window.location.href 또는 Next.js router 등을 사용하여 페이지 이동
          // 예: window.location.href = '/login';
          // Alert.alert(reissueError.response.data.message); // 웹에서는 다른 방식으로 사용자에게 알림
          alert('세션이 만료되었습니다. 다시 로그인해주세요.'); // 간단한 웹 알림
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(reissueError);
      }
    }
    console.error(
      '[authApi Response Interceptor] 처리되지 않은 에러:',
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// FormData 전송을 위한 API (accessToken 사용)
export const formDataApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  // withCredentials: true, // 필요시
});

// formDataApi 요청 인터셉터 (authApi와 동일)
formDataApi.interceptors.request.use(
  (config) => {
    console.log(
      '[formDataApi Request Interceptor] 헤더에 액세스 토큰 삽입 시도',
    );
    const accessToken = Storage.getAccessToken();
    if (accessToken) {
      console.log(
        '[formDataApi Request Interceptor] 액세스 토큰 발견:',
        accessToken.substring(0, 10) + '...',
      );
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log('[formDataApi Request Interceptor] 저장된 액세스 토큰 없음');
    }
    return config;
  },
  (error) => {
    console.error('[formDataApi Request Interceptor] 에러:', error);
    return Promise.reject(error);
  },
);

// formDataApi 응답 인터셉터 (authApi와 거의 동일, 재시도 시 formDataApi 사용하도록 수정)
formDataApi.interceptors.response.use(
  (response) => {
    console.log('[formDataApi Response Interceptor] 응답 받음');
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      console.warn(
        '[formDataApi Response Interceptor] 401 에러 발생. 토큰 재발급 시도.',
      );
      originalRequest._retry = true;

      const currentRefreshToken = Storage.getRefreshToken();
      if (!currentRefreshToken) {
        console.error(
          '[formDataApi Response Interceptor] 리프레시 토큰이 없어 재발급 불가. 로그아웃 처리 필요.',
        );
        return Promise.reject(new Error('No refresh token available.'));
      }

      try {
        console.log(
          '[formDataApi Response Interceptor] 리프레시 토큰으로 새 토큰 요청:',
          currentRefreshToken.substring(0, 10) + '...',
        );
        const reissueResponse = await refreshApi.post('/token/re-issue');

        if (reissueResponse.status === 200 || reissueResponse.status === 201) {
          const { accessToken, refreshToken: newRefreshToken } =
            reissueResponse.data;
          console.log(
            '[formDataApi Response Interceptor] 새 토큰 발급 성공:',
            accessToken.substring(0, 10) + '...',
          );

          Storage.setAccessToken(accessToken);
          if (newRefreshToken) {
            Storage.setRefreshToken(newRefreshToken);
            console.log(
              '[formDataApi Response Interceptor] 새 리프레시 토큰 저장:',
              newRefreshToken.substring(0, 10) + '...',
            );
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          // formDataApi 인스턴스의 기본 헤더 업데이트
          formDataApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          console.log('[formDataApi Response Interceptor] 원래 요청 재시도.');
          return formDataApi(originalRequest); // 원래 요청 재시도 시 formDataApi 사용
        }
      } catch (reissueError: any) {
        console.error(
          '[formDataApi Response Interceptor] 토큰 재발급 실패:',
          reissueError.response?.data || reissueError.message,
        );
        if (reissueError.response?.status === 401) {
          console.error(
            '[formDataApi Response Interceptor] 리프레시 토큰도 만료됨. 강제 로그아웃.',
          );
          Storage.clearTokens();
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
        return Promise.reject(reissueError);
      }
    }
    console.error(
      '[formDataApi Response Interceptor] 처리되지 않은 에러:',
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// 사용 예시:
// import { api, authApi, formDataApi, Storage } from './apiClient';
//
// // 로그인
// // const login = async (credentials) => {
// //   const response = await api.post('/auth/login', credentials);
// //   Storage.setAccessToken(response.data.accessToken);
// //   Storage.setRefreshToken(response.data.refreshToken);
// //   // authApi와 formDataApi의 기본 헤더를 여기서 업데이트 해줘도 좋습니다.
// //   authApi.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
// //   formDataApi.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
// // }
//
// // 로그아웃
// // const logout = async () => {
// //   try {
// //      await refreshApi.post('/auth/logout'); // 서버에 로그아웃 알림 (서버에서 refreshToken 무효화 등)
// //   } catch (e) { console.error("Logout API call failed", e); }
// //   Storage.clearTokens();
// //   delete authApi.defaults.headers.common.Authorization;
// //   delete formDataApi.defaults.headers.common.Authorization;
// //   window.location.href = '/login';
// // }
//
// // 보호된 API 호출
// // authApi.get('/protected-resource').then(response => console.log(response.data));
