import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserProvider } from './context/UserContext';
import { AIChatProvider } from './context/AIChatContext';
import AIChatWidget from './components/AIChatWidget';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <UserProvider>
      <AIChatProvider>
        <RouterProvider router={router} />
        <AIChatWidget />
        <Toaster />
      </AIChatProvider>
    </UserProvider>
  );
}