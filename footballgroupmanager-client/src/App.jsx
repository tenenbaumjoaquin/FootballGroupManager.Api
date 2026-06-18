import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Grupos from './pages/Grupos'
import Partido from './pages/Partido'
import Perfil from './pages/Perfil'
import EditarPerfil from './pages/EditarPerfil'
import RecuperarPassword from './pages/RecuperarPassword'

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
         <Route path="/perfil" element={<Perfil />} />
         <Route path="/perfil/editar" element={<EditarPerfil />} />
         <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App