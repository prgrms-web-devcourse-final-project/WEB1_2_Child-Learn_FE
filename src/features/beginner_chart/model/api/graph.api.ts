import axios from 'axios';

const graphApi = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정
graphApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

graphApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/v1/member/refresh', {
          refreshToken
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return graphApi(originalRequest);
      } catch (e) {
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { graphApi };