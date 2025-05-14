import { Children, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Button } from './components/ui/button'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  console.log(userInfo)
  const isAuthenticate = !!userInfo;
  return isAuthenticate ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  console.log(userInfo)
  const isAuthenticate = !!userInfo;
  return isAuthenticate ? <Navigate to="/chat" /> : children;
}

function App() {

  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  // console.log('second', userInfo)

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/user-info", {
          withCredentials: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include",
        })
        const data = await response.json();
        if (response.status == 200 && data?.id) {
          // console.log(data)
          setUserInfo(data);
        } else {
          setUserInfo(undefined)
        }
      } catch (error) {
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
    }
    if (!userInfo) {
      getUserInfo()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div>loading...</div>
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthRoute>
            <Auth />
          </AuthRoute>} />
          <Route path="/profile" element={<PrivateRoute>
            <Profile />
          </PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute>
            <Chat />
          </PrivateRoute>} />

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
