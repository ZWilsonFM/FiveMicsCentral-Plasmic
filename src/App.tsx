import { Routes } from '@generouted/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalContextsProvider from '../components/plasmic/fm_central/PlasmicGlobalContextsProvider';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextsProvider>
        <Routes />
      </GlobalContextsProvider>
    </QueryClientProvider>
  );
}

export default App;
