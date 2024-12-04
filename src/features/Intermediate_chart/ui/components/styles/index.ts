    // features/Intermediate_chart/ui/components/modals/styles/index.ts
  import styled from 'styled-components';
  
  export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 100;
  `;
  
  export const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    width: 100%;
    max-width: 340px;
    border-radius: 12px;
    z-index: 101;
  `;
  
  export const ModalTitle = styled.div`
    text-align: center;
    padding: 16px;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
  `;
  
  export const ModalContent = styled.div`
    padding: 20px;
  `;
  
  export const FormGroup = styled.div`
    margin-bottom: 15px;
    &:last-of-type {
      margin-bottom: 24px;
    }
  `;
  
  export const Label = styled.div`
    font-size: 13px;
    color: #333;
    margin-bottom: 4px;
  `;
  
  export const Input = styled.input`
    width: 70%;
    height: 35px;
    padding: 0 12px;
    border: 1px solid #eaeaea;
    border-radius: 6px;
    font-size: 14px;
    color: #333;
    background: white;
  
    &:disabled {
      background: white;
      color: #333;
    }
  `;
  
  export const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
  `;
  
  export const QuantityButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 35px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    background: white;
    color: #666;
    cursor: pointer;
  
    img {
      width: 12px;
      height: 12px;
    }
  
    &:hover {
      background: #f5f5f5;
    }
  
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  
  export const QuantityInput = styled(Input)`
    width: 43px;
    text-align: center;
    padding: 0;
  `;
  
  export const Button = styled.button`
    height: 40px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0 24px;
  `;
  
  export const ButtonGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 0;
  `;
  
  export const ResultRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  `;
  
  export const ResultLabel = styled.span`
    color: #666;
    font-size: 14px;
  `;
  
  export const ResultValue = styled.span`
    color: #333;
    font-size: 14px;
    font-weight: 500;
  `;
  
  export const SingleButton = styled(Button)<{ color: string }>`
    width: 100%;
    background: ${props => props.color};
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `;
  
  export const ConfirmButton = styled(Button)<{ type: 'buy' | 'sell' }>`
    background: ${props => props.type === 'buy' ? '#1B63AB' : '#1B63AB'};
    color: white;
    &:hover {
      background: ${props => props.type === 'buy' ? '#1B63AB' : '#1B63AB'};
    }
  `;
  
  export const CancelButton = styled(Button)`
    background: #D75442;
    color: white;
    &:hover {
      background: #C04937;
    }
  `;
  
  export const CompletionModalContent = styled(ModalContent)`
    text-align: center;
    padding: 24px 20px;
  `;
  
  export const CompletionMessage = styled.p`
    margin: 0 0 24px;
    color: #333;
    font-size: 16px;
    line-height: 1.5;
    white-space: pre-line;
  `;
  
  export const CompletionButtonGroup = styled(ButtonGroup)`
    margin-top: 24px;
    grid-template-columns: 1fr;
  `;
  
  export const ResultButtonGroup = styled(ButtonGroup)`
    margin: 0;
    grid-template-columns: 1fr;
    border-top: 1px solid #eee;
  `;