import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { notificationApi } from '@/features/notification/api/notificationApi';

interface SSEEvent {
  event?: 'notification';
  id?: string;
  data: string;
}

interface NotificationStateEvent {
  type: 'READ' | 'READ_ALL' | 'DELETE';
  notificationId?: number;
  memberId?: number;
}

export const useNotificationSSE = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const handleSSEEvent = useCallback(
    (eventData: SSEEvent | NotificationStateEvent) => {
      if ('event' in eventData && eventData.event === 'notification') {
        // 새 알림 이벤트 처리
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        // TODO: 토스트 메시지 표시
      } else if ('type' in eventData) {
        // 상태 변경 이벤트 처리
        switch (eventData.type) {
          case 'READ':
          case 'READ_ALL':
          case 'DELETE':
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            break;
        }
      }
    },
    [queryClient]
  );

  const connectSSE = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await notificationApi.subscribeToSSE();
      const reader = response.data.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const eventData = JSON.parse(line.slice(5));
              handleSSEEvent(eventData);
            } catch (error) {
              console.error('Failed to parse SSE message:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE error:', error);
      setTimeout(connectSSE, 5000);
    }
  }, [isAuthenticated, handleSSEEvent]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      connectSSE();
    }

    return () => {
      mounted = false;
    };
  }, [connectSSE]);
};
