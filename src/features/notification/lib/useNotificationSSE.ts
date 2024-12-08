import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { NOTIFICATION_KEYS } from '@/features/notification/lib/queries';
import { EventSourcePolyfill } from 'event-source-polyfill';
import EventSource from 'eventsource';

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
  const { isAuthenticated, accessToken } = useAuthStore();

  const handleSSEEvent = useCallback(
    (eventData: SSEEvent | NotificationStateEvent) => {
      console.log('SSE 이벤트 수신:', eventData);

      if ('event' in eventData && eventData.event === 'notification') {
        console.log('새 알림 수신');
        // 전체 알림 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_KEYS.all, // 모든 알림 관련 쿼리 무효화
          refetchType: 'active', // 활성 쿼리만 즉시 리패치
          exact: false, // 하위 쿼리도 포함
        });
      } else if ('type' in eventData) {
        console.log('알림 상태 변경:', eventData.type);
        switch (eventData.type) {
          case 'READ':
          case 'READ_ALL':
          case 'DELETE':
            queryClient.invalidateQueries({
              queryKey: NOTIFICATION_KEYS.all,
              refetchType: 'active',
              exact: false,
            });
            break;
        }
      }
    },
    [queryClient]
  );

  const connectSSE = useCallback(() => {
    if (!isAuthenticated || !accessToken) return;

    const eventSource = new EventSourcePolyfill(
      '/api/v1/notifications/subscribe',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    ) as unknown as EventSource;

    console.log('SSE 연결 시도');

    eventSource.onopen = () => {
      console.log('SSE 연결 성공');
    };

    // 일반 알림 이벤트 핸들러
    const handleNotification = (event: MessageEvent) => {
      // connected 메시지 처리
      if (event.data === 'connected') {
        console.log('SSE 초기 연결 완료');
        return;
      }

      try {
        const eventData = JSON.parse(event.data);
        console.log('알림 이벤트 수신:', eventData);
        handleSSEEvent(eventData);
      } catch (error) {
        console.error('SSE 메시지 파싱 실패:', error);
      }
    };

    // 하트비트 이벤트 핸들러
    const handleHeartbeat = (event: MessageEvent) => {
      console.log('하트비트 수신:', event.data);
    };

    // 재연결 이벤트 핸들러
    const handleRetry = (event: MessageEvent) => {
      console.log('재연결 시도:', event.data);
    };

    // 이벤트 리스너 등록
    eventSource.addEventListener('notification', handleNotification);
    eventSource.addEventListener('heartbeat', handleHeartbeat);
    eventSource.addEventListener('retry', handleRetry);

    eventSource.onerror = () => {
      console.error('SSE 연결 에러');
      eventSource.close();
      if (isAuthenticated && accessToken) {
        setTimeout(connectSSE, 3000);
      }
    };

    return () => {
      console.log('SSE 연결 종료');
      // 이벤트 리스너 제거
      eventSource.removeEventListener('notification', handleNotification);
      eventSource.removeEventListener('heartbeat', handleHeartbeat);
      eventSource.removeEventListener('retry', handleRetry);
      eventSource.close();
    };
  }, [isAuthenticated, accessToken, handleSSEEvent]);

  useEffect(() => {
    const cleanup = connectSSE();
    return () => {
      cleanup?.();
    };
  }, [connectSSE]);
};
