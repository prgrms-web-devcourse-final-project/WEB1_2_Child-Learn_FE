
export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}년 ${month}월 ${day}일 오후 ${hours}:${minutes}`;
  };
  
  export const formatDateString = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDate(date);
  };