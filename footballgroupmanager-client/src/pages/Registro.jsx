import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer
} from 'recharts'
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

function Registro() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [dropdownAbierto, setDropdownAbierto] = useState(false)

  const [form, setForm] = useState({
    nombreUsuario: '',
    email: '',
    password: '',
    nombre: '',
    posicion: '',
    stats: {
      VEL: 5, AGT: 5, PAS: 5, GMB: 5, DEF: 5,
      FIS: 5, PEG: 5, TIR: 5, ATJ: 5, REF: 5
    }
  })

  const posiciones = [
    { valor: 'ARQ', label: 'ARQUERO',   numero: '1' },
    { valor: 'DEF', label: 'DEFENSOR',  numero: '2' },
    { valor: 'VOL', label: 'VOLANTE',   numero: '5' },
    { valor: 'DEL', label: 'DELANTERO', numero: '9' },
  ]

  const statsNombres = {
    VEL: 'VEL', AGT: 'AGT', PAS: 'PAS', GMB: 'GMB',
    DEF: 'DEF', FIS: 'FIS', PEG: 'PEG', TIR: 'TIR',
    ATJ: 'ATJ', REF: 'REF'
  }

  const statsNombresCompletos = {
    VEL: 'VELOCIDAD', AGT: 'AGUANTE', PAS: 'PASE',    GMB: 'GAMBETA',
    DEF: 'DEFENSA',   FIS: 'FÍSICO',  PEG: 'PEGADA',  TIR: 'TIRO',
    ATJ: 'ATAJADA',   REF: 'REFLEJO'
  }

  const radarData = Object.entries(form.stats).map(([key, val]) => ({
    stat: statsNombres[key],
    valor: val,
    fullMark: 10
  }))

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleStat = (stat, valor) => {
    setForm({ ...form, stats: { ...form.stats, [stat]: Number(valor) } })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await authService.registro(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify({
        id: res.data.usuarioId,
        nombreUsuario: res.data.nombreUsuario,
        email: res.data.email
      }))
      navigate('/grupos')
    } catch (err) {
      const errores = err.response?.data?.errors
      if (errores) {
        setError(Object.values(errores).flat().join(' '))
      } else {
        setError(err.response?.data?.mensaje || 'Error al registrarse.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>
      <img src={logo} alt="Sale Fulbo" style={styles.logo} />

      {/* Card principal con borde pixelado */}
      <div style={styles.cardWrapper}>
        <div style={styles.cardInner}>

          {/* Pasos */}
          <div style={styles.pasos}>
            {['1. CUENTA', '2. JUGADOR', '3. STATS'].map((label, i) => (
              <div key={i} style={styles.pasoWrapper}>
                <div style={{
                  ...styles.paso,
                  ...(paso === i + 1 ? styles.pasoActivo : {})
                }}>
                  {label}
                </div>
                {i < 2 && <span style={styles.flecha}>➔</span>}
              </div>
            ))}
          </div>

          <h2 style={styles.titulo}>CREA TU CUENTA</h2>
          {error && <p style={styles.error}>{error}</p>}

          {/* PASO 1 */}
          {paso === 1 && (
            <div style={styles.form}>
              {[
                { label: 'NOMBRE DE USUARIO', name: 'nombreUsuario', type: 'text' },
                { label: 'EMAIL', name: 'email', type: 'email' },
                { label: 'CONTRASEÑA', name: 'password', type: 'password' },
              ].map(campo => (
                <div key={campo.name} style={styles.campo}>
                  <label style={styles.label}>{campo.label}</label>
                  <PixelBox>
                    <input
                      style={styles.inputInner}
                      type={campo.type}
                      name={campo.name}
                      value={form[campo.name]}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </PixelBox>
                </div>
              ))}
              <PixelBox style={{ innerBackground: '#1a7a1a' }}
                onClick={() => {
                  if (!form.nombreUsuario || !form.email || !form.password) {
                    setError('Completá todos los campos.')
                    return
                  }
                  setError('')
                  setPaso(2)
                }}>
                <div style={styles.botonTexto}>SIGUIENTE &gt;</div>
              </PixelBox>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div style={styles.form}>
              <div style={styles.campo}>
                <label style={styles.label}>NOMBRE</label>
                <PixelBox>
                  <input style={styles.inputInner} name="nombre"
                    value={form.nombre} onChange={handleChange} />
                </PixelBox>
              </div>

              <div style={styles.campo}>
                <label style={styles.label}>POSICION</label>
                <div style={{ position: 'relative' }}>
                  <PixelBox onClick={() => setDropdownAbierto(!dropdownAbierto)}>
                    <div style={styles.dropdownTrigger}>
                      <span>
                        {form.posicion
                          ? posiciones.find(p => p.valor === form.posicion)?.label
                          : 'SELECCIONAR POSICION'}
                      </span>
                      <span>▼</span>
                    </div>
                  </PixelBox>
                  {dropdownAbierto && (
                    <div style={styles.dropdownMenu}>
                      <div style={styles.dropdownHeader}>SELECCIONAR POSICION</div>
                      {posiciones.map(p => (
                        <div key={p.valor} style={styles.dropdownItem}
                          onClick={() => {
                            setForm({ ...form, posicion: p.valor })
                            setDropdownAbierto(false)
                          }}>
                          <span style={styles.numero}>{p.numero}</span>
                          {p.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.botonesPaso}>
                <PixelBox style={{ flex: 1 }} onClick={() => setPaso(1)}>
                  <div style={styles.botonTexto}>&lt; ATRAS</div>
                </PixelBox>
                <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}
                  onClick={() => {
                    if (!form.nombre || !form.posicion) {
                      setError('Completá todos los campos.')
                      return
                    }
                    setError('')
                    setPaso(3)
                  }}>
                  <div style={styles.botonTexto}>SIGUIENTE &gt;</div>
                </PixelBox>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.statsLayout}>
                <div style={styles.sliders}>
                  {Object.entries(form.stats).map(([key, val]) => (
                    <div key={key} style={styles.statRow}>
                      <label style={styles.statLabel}>{statsNombresCompletos[key]}</label>
                      <input type="range" min="0" max="10" value={val}
                        onChange={e => handleStat(key, e.target.value)}
                        style={styles.slider} />
                      <span style={styles.statValor}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.radar}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2d6a2d" />
                      <PolarAngleAxis dataKey="stat"
                        tick={{ fill: '#4cff4c', fontSize: 9, fontWeight: 'bold' }} />
                      <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar dataKey="valor" stroke="#f0c040" fill="#f0c040" fillOpacity={0.4} />
                      <Tooltip contentStyle={{
                        background: '#000', border: '1px solid #4cff4c',
                        color: '#4cff4c', fontSize: '11px'
                      }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={styles.botonesPaso}>
                <PixelBox style={{ flex: 1 }} onClick={() => setPaso(2)}>
                  <div style={styles.botonTexto}>&lt; ATRAS</div>
                </PixelBox>
                <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}>
                  <button type="submit" style={styles.botonSubmit} disabled={cargando}>
                    {cargando ? 'CREANDO...' : 'CREAR CUENTA >'}
                  </button>
                </PixelBox>
              </div>
            </form>
          )}

          <p style={styles.linkTexto}>
            ¿YA TENES CUENTA?{' '}
            <Link to="/login" style={styles.link}>INICIA SESION</Link>
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
    width: '600px',
    maxWidth: '90%',
    marginBottom: '20px',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
  },
  cardWrapper: {
    background: '#fff',
    clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
    width: '100%',
    maxWidth: '720px',
  },
  cardInner: {
    margin: '3px',
    background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '28px 36px',
  },
  pasos: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  pasoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  paso: {
    padding: '8px 14px',
    border: '2px solid #fff',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1px',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
  },
  pasoActivo: {
    background: '#1a7a1a',
    border: '2px solid #4cff4c',
    color: '#4cff4c',
  },
  flecha: { color: '#fff', fontSize: '16px' },
  titulo: {
    color: '#4cff4c',
    fontSize: '16px',
    letterSpacing: '2px',
    marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
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
  dropdownTrigger: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    fontSize: '11px',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#000',
    border: '2px solid #fff',
    zIndex: 10,
  },
  dropdownHeader: {
    padding: '10px 14px',
    color: '#fff',
    fontSize: '10px',
    background: '#1a7a1a',
    letterSpacing: '1px',
  },
  dropdownItem: {
    padding: '10px 14px',
    color: '#fff',
    fontSize: '11px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderTop: '1px solid #222',
  },
  numero: {
    background: '#1a7a1a',
    border: '2px solid #4cff4c',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '900',
    color: '#fff',
    fontFamily: "'Press Start 2P', cursive",
  },
  error: {
    color: '#ff4c4c', fontSize: '10px',
    marginBottom: '8px', fontWeight: '700',
  },
  botonTexto: {
    color: '#fff', fontSize: '12px',
    fontWeight: '900', letterSpacing: '2px',
    textAlign: 'center', cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonSubmit: {
    background: 'transparent', border: 'none',
    color: '#fff', fontSize: '12px',
    fontWeight: '900', letterSpacing: '2px',
    cursor: 'pointer', width: '100%',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonesPaso: { display: 'flex', gap: '12px', marginTop: '8px' },
  statsLayout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  sliders: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  statRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  statLabel: {
    color: '#4cff4c', fontSize: '8px',
    fontWeight: '700', width: '68px',
  },
  slider: { flex: 1 },
  statValor: {
    color: '#f0c040', fontWeight: '900',
    fontSize: '12px', width: '18px', textAlign: 'center',
  },
  radar: { width: '260px', flexShrink: 0 },
  linkTexto: {
    textAlign: 'center', marginTop: '20px',
    color: '#fff', fontSize: '10px',
    fontWeight: '700', letterSpacing: '1px',
  },
  link: { color: '#f0c040', textDecoration: 'none' },
}

export default Registro