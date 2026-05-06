import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await authService.login(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify({
        id: res.data.usuarioId,
        nombreUsuario: res.data.nombreUsuario,
        email: res.data.email
      }))
      navigate('/grupos')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>⚽ Football Manager</h1>
        <h2 style={styles.subtitulo}>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.campo}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Contraseña</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.boton} type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={styles.link}>
          ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  titulo: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '8px',
    color: '#1a1a2e',
  },
  subtitulo: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    fontWeight: 'normal',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
  },
  boton: {
    padding: '13px',
    background: '#0f3460',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px',
    transition: 'background 0.2s',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#666',
  },
}

export default Login