export interface BeginQuiz {
    content: string;
    oContent: string;
    xContent: string;
    answer: 'O' | 'X';
}

export interface StockData {
    tradeDay: string;
    price: number;
}

export interface BeginStockResponse {
    stockData: StockData[];
    quiz: BeginQuiz[];
}