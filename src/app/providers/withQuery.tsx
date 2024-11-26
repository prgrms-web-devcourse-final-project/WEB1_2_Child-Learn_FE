import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof Error) {
          console.error('Global Error:', error.message);
        }
      },
    },
  },
});

export const withQuery = (Component: React.ComponentType) => {
  return function WithQueryProvider() {
    return (
      <QueryClientProvider client={queryClient}>
        <Component />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  };
};