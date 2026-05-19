import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import logo from '../assets/logo.png'
import fondo from '../assets/fondo.png'

const PixelBox = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    position: 'relative',
    background: '#fff',
    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
    ...style,
  }}>
    <div style={{
      margin: '2px',
      background: style.innerBackground || '#000',
      clipPath: 'polygon(5px 0%, calc(100% - 5px) 0%, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0% calc(100% - 5px), 0% 5px)',
      padding: style.padding || '12px 16px',
    }}>
      {children}
    </div>
  </div>
)

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
      setError(err.response?.data?.mensaje || 'EMAIL O CONTRASEÑA INCORRECTOS.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>
      <img src={logo} alt="Sale Fulbo" style={styles.logo} />

      <div style={styles.cardWrapper}>
        <div style={styles.cardInner}>

          <h2 style={styles.titulo}>INICIAR SESION</h2>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.campo}>
              <label style={styles.label}>EMAIL</label>
              <PixelBox>
                <input
                  style={styles.inputInner}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </PixelBox>
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>CONTRASEÑA</label>
              <PixelBox>
                <input
                  style={styles.inputInner}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </PixelBox>
            </div>

            <PixelBox style={{ innerBackground: '#1a7a1a', marginTop: '8px' }}>
              <button type="submit" style={styles.botonSubmit} disabled={cargando}>
                {cargando ? 'INGRESANDO...' : 'INGRESAR >'}
              </button>
            </PixelBox>
          </form>

          <p style={styles.linkTexto}>
            ¿NO TENES CUENTA?{' '}
            <Link to="/registro" style={styles.link}>REGISTRATE</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  logo: {
    width: '360px',
    maxWidth: '90%',
    marginBottom: '20px',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
  },
  cardWrapper: {
    background: '#fff',
    clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
    width: '100%',
    maxWidth: '480px',
  },
  cardInner: {
    margin: '3px',
    background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '32px 36px',
  },
  titulo: {
    color: '#4cff4c',
    fontSize: '16px',
    letterSpacing: '2px',
    marginBottom: '28px',
    textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    color: '#4cff4c', fontSize: '10px',
    fontWeight: '700', letterSpacing: '1px',
  },
  inputInner: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '11px',
    outline: 'none',
    width: '100%',
    fontFamily: "'Press Start 2P', cursive",
  },
  error: {
    color: '#ff4c4c', fontSize: '10px',
    marginBottom: '12px', fontWeight: '700',
    textAlign: 'center', lineHeight: '1.6',
  },
  botonSubmit: {
    background: 'transparent', border: 'none',
    color: '#fff', fontSize: '12px',
    fontWeight: '900', letterSpacing: '2px',
    cursor: 'pointer', width: '100%',
    fontFamily: "'Press Start 2P', cursive",
    textAlign: 'center',
  },
  linkTexto: {
    textAlign: 'center', marginTop: '24px',
    color: '#fff', fontSize: '10px',
    fontWeight: '700', letterSpacing: '1px',
    lineHeight: '1.8',
  },
  link: { color: '#f0c040', textDecoration: 'none' },
}

export default Login