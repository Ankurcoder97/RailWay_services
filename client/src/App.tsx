import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LiveDashboard from './pages/LiveDashboard.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveDashboard />
    </QueryClientProvider>
  );
}
