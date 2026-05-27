import { Routes } from '@generouted/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalContextsProvider from '../components/plasmic/fm_central/PlasmicGlobalContextsProvider';
import { AuthProvider } from './contexts/AuthContext';

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
      <AuthProvider>
        <GlobalContextsProvider>
          <Routes />
        </GlobalContextsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
