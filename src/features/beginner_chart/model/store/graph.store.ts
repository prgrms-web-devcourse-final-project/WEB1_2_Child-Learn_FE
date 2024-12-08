import { create } from 'zustand';
import axios from 'axios';
import { BeginStockResponse } from '@/features/beginner_chart/model/types/stock';
import { FastGraphData } from '@/features/beginner_chart/model/types/graph';

// 그래프 전용 API 인스턴스 생성
const graphApi = axios.create({
  baseURL: 'http://43.202.106.45',  // 실제 서버 URL로 변경
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  // CORS 설정
  },
  withCredentials: true  // 인증 정보 포함
});

// 인터셉터 설정
graphApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // CORS 관련 헤더 추가
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
      config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
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

interface GraphStore {
 stockData: FastGraphData[];
 isLoading: boolean;
 error: string | null;
 fetchStockData: () => Promise<void>;
}

export const useGraphStore = create<GraphStore>((set) => ({
 stockData: [],
 isLoading: false,
 error: null,
 fetchStockData: async () => {
   try {
     set({ isLoading: true });
     const response = await graphApi.get<BeginStockResponse>('/begin-stocks');
     
     if (response.data.stockData) {
       // 오늘 날짜를 중간으로 재배열
       const today = new Date().getDay();
       const daysOrder = ['월', '화', '수', '목', '금', '토', '일'];
       const adjustedToday = today === 0 ? 6 : today - 1;
       
       const reorderedData = [...response.data.stockData];
       const halfLength = Math.floor(daysOrder.length / 2);
       const startIdx = (adjustedToday - halfLength + 7) % 7;
       
       const orderedData = new Array(7);
       for (let i = 0; i < 7; i++) {
         const dataIdx = (startIdx + i) % 7;
         const dayData = reorderedData.find(d => d.tradeDay === daysOrder[dataIdx]);
         if (dayData) {
           orderedData[i] = {
             value: dayData.price,
             date: dayData.tradeDay
           };
         }
       }
       
       set({ stockData: orderedData, isLoading: false });
     }
   } catch (error) {
     set({ error: '데이터 로딩 실패', isLoading: false });
     console.error('Stock data fetch error:', error);
   }
 }
}));