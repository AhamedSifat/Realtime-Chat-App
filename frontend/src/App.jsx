import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import { Loader } from 'lucide-react';
import useAuthStore from './store/useAuthStore';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={authUser ? <Home /> : <Navigate to='/login' />}
        />
        <Route
          path='/login'
          element={!authUser ? <LogIn /> : <Navigate to='/' />}
        />
        <Route
          path='/signup'
          element={!authUser ? <SignUp /> : <Navigate to='/' />}
        />
        <Route
          path='/profile'
          element={authUser ? <Profile /> : <Navigate to='/login' />}
        />
        <Route path='/settings' element={<Settings />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
