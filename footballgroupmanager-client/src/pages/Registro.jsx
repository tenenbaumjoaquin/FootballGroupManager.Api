import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

function Registro() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

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

  const statsNombres = {
    VEL: 'Velocidad', AGT: 'Aguante', PAS: 'Pase', GMB: 'Gambeta',
    DEF: 'Defensa', FIS: 'Físico', PEG: 'Pegada', TIR: 'Tiro',
    ATJ: 'Atajada', REF: 'Reflejo'
  }

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
        const mensajes = Object.values(errores).flat().join(' ')
        setError(mensajes)
      } else {
        setError(err.response?.data?.mensaje || 'Error al registrarse.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>⚽ Football Manager</h1>
        <h2 style={styles.subtitulo}>Crear cuenta</h2>

        {/* Indicador de pasos */}
        <div style={styles.pasos}>
          <div style={{ ...styles.paso, ...(paso >= 1 ? styles.pasoActivo : {}) }}>1. Cuenta</div>
          <div style={styles.lineaPaso}></div>
          <div style={{ ...styles.paso, ...(paso >= 2 ? styles.pasoActivo : {}) }}>2. Jugador</div>
          <div style={styles.lineaPaso}></div>
          <div style={{ ...styles.paso, ...(paso >= 3 ? styles.pasoActivo : {}) }}>3. Stats</div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* Paso 1 — datos de cuenta */}
        {paso === 1 && (
          <div style={styles.form}>
            <div style={styles.campo}>
              <label style={styles.label}>Nombre de usuario</label>
              <input style={styles.input} name="nombreUsuario"
                value={form.nombreUsuario} onChange={handleChange}
                placeholder="juanperez" required />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="tu@email.com" required />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Contraseña</label>
              <input style={styles.input} type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="Mínimo 6 caracteres" required />
            </div>
            <button style={styles.boton} onClick={() => {
              if (!form.nombreUsuario || !form.email || !form.password) {
                setError('Completá todos los campos.')
                return
              }
              setError('')
              setPaso(2)
            }}>
              Siguiente →
            </button>
          </div>
        )}

        {/* Paso 2 — perfil de jugador */}
        {paso === 2 && (
          <div style={styles.form}>
            <div style={styles.campo}>
              <label style={styles.label}>Tu nombre real</label>
              <input style={styles.input} name="nombre"
                value={form.nombre} onChange={handleChange}
                placeholder="Juan Pérez" required />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Posición</label>
              <select style={styles.input} name="posicion"
                value={form.posicion} onChange={handleChange} required>
                <option value="">Seleccioná tu posición</option>
                <option value="ARQ">🧤 Arquero</option>
                <option value="DEF">🛡️ Defensor</option>
                <option value="VOL">⚙️ Volante</option>
                <option value="DEL">⚡ Delantero</option>
              </select>
            </div>
            <div style={styles.botonesPaso}>
              <button style={styles.botonSecundario} onClick={() => setPaso(1)}>
                ← Atrás
              </button>
              <button style={styles.boton} onClick={() => {
                if (!form.nombre || !form.posicion) {
                  setError('Completá todos los campos.')
                  return
                }
                setError('')
                setPaso(3)
              }}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Paso 3 — estadísticas */}
        {paso === 3 && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <p style={styles.ayuda}>
              Poné tu puntuación del 0 al 10 en cada estadística. ¡Sé honesto!
            </p>
            <div style={styles.statsGrid}>
              {Object.entries(form.stats).map(([key, val]) => (
                <div key={key} style={styles.statRow}>
                  <label style={styles.statLabel}>{statsNombres[key]}</label>
                  <input
                    type="range" min="0" max="10" value={val}
                    onChange={e => handleStat(key, e.target.value)}
                    style={styles.slider}
                  />
                  <span style={styles.statValor}>{val}</span>
                </div>
              ))}
            </div>
            <div style={styles.botonesPaso}>
              <button type="button" style={styles.botonSecundario} onClick={() => setPaso(2)}>
                ← Atrás
              </button>
              <button type="submit" style={styles.boton} disabled={cargando}>
                {cargando ? 'Creando cuenta...' : 'Crear cuenta ✓'}
              </button>
            </div>
          </form>
        )}

        <p style={styles.link}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px',
  },
  card: {
    background: 'white', borderRadius: '16px', padding: '40px',
    width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  titulo: { textAlign: 'center', fontSize: '26px', marginBottom: '6px', color: '#1a1a2e' },
  subtitulo: {
    textAlign: 'center', fontSize: '15px', color: '#666',
    marginBottom: '24px', fontWeight: 'normal',
  },
  pasos: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '28px', gap: '8px',
  },
  paso: {
    padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
    background: '#eee', color: '#888', fontWeight: '500',
  },
  pasoActivo: { background: '#0f3460', color: 'white' },
  lineaPaso: { height: '2px', width: '24px', background: '#ddd' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#333' },
  input: {
    padding: '11px 14px', borderRadius: '8px',
    border: '1.5px solid #ddd', fontSize: '15px', outline: 'none',
  },
  error: { color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginBottom: '8px' },
  ayuda: { fontSize: '13px', color: '#888', textAlign: 'center' },
  statsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  statLabel: { fontSize: '13px', fontWeight: '500', width: '70px', color: '#333' },
  slider: { flex: 1 },
  statValor: {
    fontSize: '14px', fontWeight: '700', color: '#0f3460',
    width: '24px', textAlign: 'center',
  },
  botonesPaso: { display: 'flex', gap: '10px', marginTop: '8px' },
  boton: {
    flex: 1, padding: '12px', background: '#0f3460', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  },
  botonSecundario: {
    flex: 1, padding: '12px', background: 'transparent', color: '#0f3460',
    border: '1.5px solid #0f3460', borderRadius: '8px', fontSize: '15px',
  },
  link: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
}

export default Registro