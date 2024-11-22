import { MidStock, MidStockPrice, CandlestickData } from '../types/stock';

// 중급 주식 데이터
export const midStocks: MidStock[] = [
  { mid_stock_id: 1, mid_name: "삼성전자" },
  { mid_stock_id: 2, mid_name: "SK하이닉스" },
  { mid_stock_id: 3, mid_name: "현대차" }
];

// 14일치 가격 데이터 생성 함수
const generatePriceData = (basePrice: number, volatility: number): MidStockPrice[] => {
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return date.toISOString().split('T')[0];
  });

  return dates.map((date, index) => {
    const dayVolatility = Math.random() * volatility;
    const high = Math.round(basePrice * (1 + dayVolatility));
    const low = Math.round(basePrice * (1 - dayVolatility));
    const avg = Math.round((high + low) / 2);

    return {
      mid_stock_price_id: index + 1,
      mid_list_id: 1,
      high_price: high,
      low_price: low,
      avg_price: avg,
      price_date: date
    };
  });
};

// 주식별 가격 데이터
export const stockPriceData = {
  1: generatePriceData(68000, 0.02),  // 삼성전자
  2: generatePriceData(125000, 0.025), // SK하이닉스
  3: generatePriceData(250000, 0.015)  // 현대차
};

// 캔들스틱 차트 옵션
export const chartOptions = {
  chart: {
    type: 'candlestick',
    height: 350,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#1B63AB',
        downward: '#D75442'
      }
    }
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  }
};

// 각 주식의 뉴스 데이터
export const stockNews = {
  1: {
    title: "삼성전자 실적 전망",
    content: "반도체 업황 회복에 따른 실적 개선 기대감...",
    imageUrl: "/images/samsung.jpg"
  },
  2: {
    title: "SK하이닉스 투자 계획",
    content: "차세대 메모리 반도체 개발 투자 확대...",
    imageUrl: "/images/skhynix.jpg"
  },
  3: {
    title: "현대차 신차 출시",
    content: "신형 전기차 라인업 확대 계획 발표...",
    imageUrl: "/images/hyundai.jpg"
  }
};