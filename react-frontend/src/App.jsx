import { BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AuthCallback from './components/AuthCallback'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />}></Route>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<h1>Home - Redirect to Login</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
