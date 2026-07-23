import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AppLayout = () => (
  <div className="min-h-screen bg-base text-ink">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
