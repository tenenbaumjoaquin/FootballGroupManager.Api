import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Grupos from './pages/Grupos'
import Partido from './pages/Partido'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/grupos" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/grupos/:grupoId/partido" element={<Partido />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App