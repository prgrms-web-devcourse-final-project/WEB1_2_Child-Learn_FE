// QuizGraphPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FastGraph } from '@/features/beginner_chart/ui/fast-graph/fast-graph';
import { useGraphStore } from '@/features/beginner_chart/model/store/graph.store';
import { useQuizStore } from '@/features/beginner_chart/model/store/quiz.store';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';

const PageContainer = styled.div`
 padding: 20px;
 background-color: #ffffff;
 min-height: 100vh;
 max-width: 700px;
 margin: 0 auto;
 position: relative;
`;

const TopBar = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 10px;
`;

const OutButton = styled.button`
 background: none;
 border: none;
 cursor: pointer;
 padding: 0;
 z-index: 10;
 
 img {
   width: 22px;
   height: 22px;
 }
`;

const CardWrapper = styled.div`
 width: 100%;
 background: white;
 border-radius: 12px;
 padding: 16px;
 margin-bottom: 20px;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DateDisplay = styled.div`
 text-align: right;
 padding: 8px;
 color: #666;
 font-size: 14px;
 margin-bottom: 16px;
`;

const ArticleContainer = styled.div`
 width: 100%;
 background: #fff;
 border-radius: 12px;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 overflow: hidden;
 margin-bottom: 20px;
`;

const ArticleHeader = styled.div`
 padding: 16px;
 text-align: center;
 border-bottom: 1px solid #eee;
`;

const ArticleTitle = styled.h1`
 font-size: 18px;
 color: #000000;
 font-weight: bold;
 margin: 0;
`;

const ArticleDate = styled.div`
 font-size: 12px;
 color: #666;
 text-align: right;
 padding: 8px 16px;
`;

const QuizContent = styled.div`
 padding: 20px;
`;

const QuizQuestion = styled.h2`
 font-size: 16px;
 font-weight: bold;
 color: #000000;
 margin-bottom: 20px;
`;

const AnswerButton = styled.button<{ $type: 'O' | 'X', $isSelected?: boolean }>`
 width: 100%;
 padding: 16px;
 border: 1px solid ${props => props.$isSelected ? '#82C8BB' : '#e0e0e0'};
 border-radius: 8px;
 background: ${props => props.$isSelected ? '#f5fffd' : 'white'};
 margin-bottom: 12px;
 display: flex;
 align-items: center;
 gap: 12px;
 cursor: pointer;
 text-align: left;

 &:hover {
   background: ${props => props.$isSelected ? '#f5fffd' : '#f5f5f5'};
 }
`;

const AnswerCircle = styled.div<{ $type: 'O' | 'X' }>`
 width: 24px;
 height: 24px;
 border-radius: 50%;
 background-color: ${props => props.$type === 'O' ? '#4A90E2' : '#E25C5C'};
 display: flex;
 align-items: center;
 justify-content: center;
 color: white;
 font-weight: bold;
`;

const AnswerText = styled.span`
 font-size: 14px;
 color: #333;
`;

const ModalOverlay = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: rgba(0, 0, 0, 0.5);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 1000;
`;

const ModalContent = styled.div`
 background: white;
 padding: 24px;
 border-radius: 12px;
 width: 80%;
 max-width: 320px;
 text-align: center;
`;

const ModalText = styled.p`
 font-size: 16px;
 margin-bottom: 16px;
 color: #333;
`;

const PointText = styled.p`
 font-size: 14px;
 color: #82C8BB;
 margin: 8px 0;
`;

const ConfirmButton = styled.button`
 background: #82C8BB;
 color: white;
 border: none;
 padding: 10px 40px;
 border-radius: 20px;
 margin-top: 20px;
 cursor: pointer;
 font-size: 16px;
`;

const QuizGraphPage: React.FC = () => {
 const navigate = useNavigate();
 const [showArticle, setShowArticle] = useState(false);
 const [selectedAnswer, setSelectedAnswer] = useState<string>();
 const [showModal, setShowModal] = useState(false);
 const [earnedPoints, setEarnedPoints] = useState<number>(0);
 
 const { stockData, fetchStockData, isLoading } = useGraphStore();
 const { currentQuiz, submitAnswer, fetchQuizzes } = useQuizStore();

 useEffect(() => {
    fetchStockData();
    fetchQuizzes();
  }, []);

 const handleChartClick = () => {
   setShowArticle(true);
 };

 const handleAnswer = async (answer: string) => {
   try {
     setSelectedAnswer(answer);
     const result = await submitAnswer(answer);
     if (result && 'points' in result) {
       setEarnedPoints(result.points ?? 0);
     }
     setShowModal(true);
   } catch (error) {
     console.error('Error submitting answer:', error);
   }
 };

 const handleModalClose = () => {
   setShowModal(false);
   setShowArticle(false);
 };

 if (isLoading) {
   return <div>Loading...</div>;
 }

 return (
   <PageContainer>
     <TopBar>
       <OutButton onClick={() => navigate('/main')}>
         <img src="/img/out.png" alt="나가기" />
       </OutButton>
       <PointBadge/>
     </TopBar>

     <CardWrapper>
       <FastGraph data={stockData} onChartClick={handleChartClick} />
     </CardWrapper>

     {showArticle && (
       <ArticleContainer>
         <ArticleHeader>
           <ArticleTitle>Child-Learn News</ArticleTitle>
         </ArticleHeader>
         <ArticleDate>2024.12.3</ArticleDate>
         <QuizContent>
           <QuizQuestion>
             {currentQuiz?.content}
           </QuizQuestion>
           
           <AnswerButton 
             $type="O" 
             $isSelected={selectedAnswer === "O"}
             onClick={() => handleAnswer("O")}
             disabled={!!selectedAnswer}
           >
             <AnswerCircle $type="O">O</AnswerCircle>
             <AnswerText>{currentQuiz?.oContent}</AnswerText>
           </AnswerButton>
           
           <AnswerButton 
             $type="X" 
             $isSelected={selectedAnswer === "X"}
             onClick={() => handleAnswer("X")}
             disabled={!!selectedAnswer}
           >
             <AnswerCircle $type="X">X</AnswerCircle>
             <AnswerText>{currentQuiz?.xContent}</AnswerText>
           </AnswerButton>
         </QuizContent>
       </ArticleContainer>
     )}

     {showModal && (
       <ModalOverlay>
         <ModalContent>
           <ModalText>
             {selectedAnswer === currentQuiz?.answer 
               ? '정답입니다!' 
               : '내일 다시 도전해봐요!'}
           </ModalText>
           {earnedPoints > 0 && (
             <PointText>
               +{earnedPoints} 포인트를 획득했습니다!
             </PointText>
           )}
           <ConfirmButton onClick={handleModalClose}>
             확인
           </ConfirmButton>
         </ModalContent>
       </ModalOverlay>
     )}
   </PageContainer>
 );
};

export default QuizGraphPage;