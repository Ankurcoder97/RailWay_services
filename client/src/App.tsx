import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTrainStore } from './store/useTrainStore.js';
import Home from './pages/Home.js';
import LiveDashboard from './pages/LiveDashboard.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppContent() {
  const { selectedTrainNumber } = useTrainStore();

  return (
    <>
      {selectedTrainNumber ? (
        <LiveDashboard />
      ) : (
        <Home />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
