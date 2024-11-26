import axios from 'axios';

export const baseApi = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 송수신을 위한 설정
});
