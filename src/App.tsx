import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/store/appStore';
import { router } from '@/router';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
