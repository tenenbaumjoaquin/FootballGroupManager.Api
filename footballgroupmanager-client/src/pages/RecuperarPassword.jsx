import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usuarioService } from '../services/api'
import logo from '../assets/logo.svg'
import fondo from '../assets/fondo.png'

const PixelBox = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    position: 'relative',
    background: '#fff',
    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>
    <div style={{
      margin: '2px',
      background: style.innerBackground || '#000',
      clipPath: 'polygon(5px 0%, calc(100% - 5px) 0%, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0% calc(100% - 5px), 0% 5px)',
      padding: style.padding || '12px 16px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  </div>
)

function RecuperarPassword() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [email, setEmail] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleVerificarEmail = async () => {
    if (!email) {
      setError('INGRESÁ TU EMAIL.')
      return
    }
    setError('')
    setCargando(true)
    try {
      const res = await usuarioService.verificarEmail(email)
      if (res.data.existe) {
        setPaso(2)
      } else {
        setError('NO EXISTE UNA CUENTA CON ESE EMAIL.')
      }
    } catch {
      setError('ERROR AL VERIFICAR EL EMAIL.')
    } finally {
      setCargando(false)
    }
  }

  const handleCambiarPassword = async () => {
    if (!nuevaPassword || !confirmarPassword) {
      setError('COMPLETÁ TODOS LOS CAMPOS.')
      return
    }
    if (nuevaPassword.length < 6) {
      setError('LA CONTRASEÑA DEBE TENER AL MENOS 6 CARACTERES.')
      return
    }
    if (nuevaPassword !== confirmarPassword) {
      setError('LAS CONTRASEÑAS NO COINCIDEN.')
      return
    }
    setError('')
    setCargando(true)
    try {
      await usuarioService.cambiarPassword({
        email,
        nuevaPassword,
      })
      setPaso(3)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL CAMBIAR LA CONTRASEÑA.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>
      <img src={logo} alt="Sale Fulbo" style={styles.logo} />

      <div style={styles.cardWrapper}>
        <div style={styles.cardInner}>

          <h2 style={styles.titulo}>RECUPERAR CONTRASEÑA</h2>

          {error && <p style={styles.error}>{error}</p>}

          {/* PASO 1 — Verificar email */}
          {paso === 1 && (
            <div style={styles.form}>
              <p style={styles.descripcion}>
                INGRESÁ TU EMAIL PARA RECUPERAR TU CONTRASEÑA.
              </p>
              <div style={styles.campo}>
                <label style={styles.label}>EMAIL</label>
                <PixelBox>
                  <input
                    style={styles.inputInner}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="off"
                  />
                </PixelBox>
              </div>
              <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={handleVerificarEmail}>
                <span style={styles.botonTexto}>
                  {cargando ? 'VERIFICANDO...' : 'CONTINUAR >'}
                </span>
              </PixelBox>
              <p style={styles.linkTexto}>
                <Link to="/login" style={styles.link}>VOLVER AL LOGIN</Link>
              </p>
            </div>
          )}

          {/* PASO 2 — Nueva contraseña */}
          {paso === 2 && (
            <div style={styles.form}>
              <p style={styles.descripcion}>
                CUENTA ENCONTRADA. INGRESÁ TU NUEVA CONTRASEÑA.
              </p>
              <div style={styles.campo}>
                <label style={styles.label}>NUEVA CONTRASEÑA</label>
                <PixelBox>
                  <input
                    style={styles.inputInner}
                    type="password"
                    value={nuevaPassword}
                    onChange={e => setNuevaPassword(e.target.value)}
                  />
                </PixelBox>
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>CONFIRMAR CONTRASEÑA</label>
                <PixelBox>
                  <input
                    style={styles.inputInner}
                    type="password"
                    value={confirmarPassword}
                    onChange={e => setConfirmarPassword(e.target.value)}
                  />
                </PixelBox>
              </div>
              <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={handleCambiarPassword}>
                <span style={styles.botonTexto}>
                  {cargando ? 'GUARDANDO...' : 'GUARDAR >'}
                </span>
              </PixelBox>
            </div>
          )}

          {/* PASO 3 — Éxito */}
          {paso === 3 && (
            <div style={styles.form}>
              <p style={{ ...styles.descripcion, color: '#4cff4c' }}>
                ✔ CONTRASEÑA ACTUALIZADA CORRECTAMENTE.
              </p>
              <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={() => navigate('/login')}>
                <span style={styles.botonTexto}>IR AL LOGIN &gt;</span>
              </PixelBox>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', backgroundSize: 'cover',
    backgroundRepeat: 'repeat', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '20px',
  },
  logo: {
    width: '520px', maxWidth: '90%', marginBottom: '20px',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
  },
  cardWrapper: {
    background: '#fff',
    clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
    width: '100%', maxWidth: '480px',
  },
  cardInner: {
    margin: '3px', background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '32px 36px',
  },
  titulo: {
    color: '#4cff4c', fontSize: '13px',
    letterSpacing: '2px', marginBottom: '24px', textAlign: 'center',
  },
  descripcion: {
    color: '#888', fontSize: '9px',
    lineHeight: '1.8', letterSpacing: '1px', textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#4cff4c', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' },
  inputInner: {
    background: 'transparent', border: 'none',
    color: '#fff', fontSize: '11px',
    outline: 'none', width: '100%',
    fontFamily: "'Press Start 2P', cursive",
  },
  error: {
    color: '#ff4c4c', fontSize: '10px',
    marginBottom: '8px', textAlign: 'center', lineHeight: '1.6',
  },
  botonTexto: {
    color: '#fff', fontSize: '11px', fontWeight: '900',
    letterSpacing: '1px', cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  linkTexto: { textAlign: 'center', marginTop: '8px' },
  link: { color: '#f0c040', textDecoration: 'none', fontSize: '10px' },
}

export default RecuperarPassword