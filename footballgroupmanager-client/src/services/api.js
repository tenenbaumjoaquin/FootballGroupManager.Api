import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7201/api',
})

// Interceptor — agrega el token JWT automáticamente a cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor — si el token expiró, redirige al login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Cliente sin autenticación — para login y registro
const apiPublica = axios.create({
  baseURL: 'https://localhost:7201/api',
})

export const authService = {
  login: (data) => apiPublica.post('/auth/login', data),
  registro: (data) => apiPublica.post('/auth/registro', data),
}

export const usuarioService = {
  miPerfil: () => api.get('/usuarios/me'),
  actualizar: (data) => api.put('/usuarios/me', data),
  eliminar: () => api.delete('/usuarios/me'),
}

export const grupoService = {
  misGrupos: () => api.get('/grupos'),
  obtenerPorId: (id) => api.get(`/grupos/${id}`),
  crear: (data) => api.post('/grupos', data),
  unirse: (codigo) => api.post(`/grupos/unirse?codigo=${codigo}`),
  abandonar: (grupoId) => api.delete(`/grupos/${grupoId}/abandonar`),
  eliminar: (grupoId) => api.delete(`/grupos/${grupoId}`),
}

export const partidoService = {
  obtenerActivo: (grupoId) => api.get(`/partidos/grupo/${grupoId}/activo`),
  obtenerHistorial: (grupoId) => api.get(`/partidos/grupo/${grupoId}/historial`),
  crear: (grupoId) => api.post(`/partidos/grupo/${grupoId}`),
  confirmar: (partidoId) => api.post(`/partidos/${partidoId}/confirmar`),
  cancelar: (partidoId) => api.delete(`/partidos/${partidoId}/cancelar`),
  generarEquipos: (partidoId) => api.post(`/partidos/${partidoId}/equipos`),
  marcarJugado: (partidoId) => api.post(`/partidos/${partidoId}/jugado`),
}


export default api