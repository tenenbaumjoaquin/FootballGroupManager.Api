import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { grupoService } from '../services/api'

function Grupos() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const [grupos, setGrupos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalCrear, setModalCrear] = useState(false)
  const [modalUnirse, setModalUnirse] = useState(false)
  const [nombreGrupo, setNombreGrupo] = useState('')
  const [codigoGrupo, setCodigoGrupo] = useState('')

  useEffect(() => {
    cargarGrupos()
  }, [])

  const cargarGrupos = async () => {
    try {
      const res = await grupoService.misGrupos()
      setGrupos(res.data)
    } catch {
      setError('Error al cargar los grupos.')
    } finally {
      setCargando(false)
    }
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    try {
      await grupoService.crear({ nombre: nombreGrupo })
      setModalCrear(false)
      setNombreGrupo('')
      cargarGrupos()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear el grupo.')
    }
  }

  const handleUnirse = async (e) => {
    e.preventDefault()
    try {
      await grupoService.unirse(codigoGrupo)
      setModalUnirse(false)
      setCodigoGrupo('')
      cargarGrupos()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al unirse al grupo.')
    }
  }

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>⚽ Football Manager</h1>
        <div style={styles.headerDerecha}>
          <span style={styles.bienvenida}>Hola, {usuario?.nombreUsuario}</span>
          <button style={styles.botonSecundario} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.acciones}>
          <h2 style={styles.subtitulo}>Mis grupos</h2>
          <div style={styles.botonesAccion}>
            <button style={styles.boton} onClick={() => setModalCrear(true)}>
              + Crear grupo
            </button>
            <button style={styles.botonSecundario} onClick={() => setModalUnirse(true)}>
              Unirse con código
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {cargando ? (
          <p style={styles.mensaje}>Cargando grupos...</p>
        ) : grupos.length === 0 ? (
          <div style={styles.vacio}>
            <p>No pertenecés a ningún grupo todavía.</p>
            <p>Creá uno o unite con un código.</p>
          </div>
        ) : (
          <div style={styles.grilla}>
            {grupos.map(grupo => (
              <div
                key={grupo.id}
                style={styles.tarjeta}
                onClick={() => navigate(`/grupos/${grupo.id}/partido`)}
              >
                <h3 style={styles.nombreGrupo}>{grupo.nombre}</h3>
                <p style={styles.codigo}>Código: <strong>{grupo.codigo}</strong></p>
                <p style={styles.miembros}>
                  👥 {grupo.miembros.length + 1} miembro{grupo.miembros.length !== 0 ? 's' : ''}
                </p>
                <p style={styles.creador}>
                  {grupo.creador.nombreUsuario === usuario?.nombreUsuario
                    ? '⭐ Sos el creador'
                    : `Creado por ${grupo.creador.nombreUsuario}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal crear grupo */}
      {modalCrear && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitulo}>Crear grupo</h3>
            <form onSubmit={handleCrear} style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Nombre del grupo"
                value={nombreGrupo}
                onChange={e => setNombreGrupo(e.target.value)}
                required
              />
              <div style={styles.modalBotones}>
                <button style={styles.boton} type="submit">Crear</button>
                <button style={styles.botonSecundario} type="button"
                  onClick={() => setModalCrear(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal unirse */}
      {modalUnirse && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitulo}>Unirse a un grupo</h3>
            <form onSubmit={handleUnirse} style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Código del grupo (ej: C7G3A7)"
                value={codigoGrupo}
                onChange={e => setCodigoGrupo(e.target.value.toUpperCase())}
                required
              />
              <div style={styles.modalBotones}>
                <button style={styles.boton} type="submit">Unirse</button>
                <button style={styles.botonSecundario} type="button"
                  onClick={() => setModalUnirse(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: { color: 'white', fontSize: '22px' },
  headerDerecha: { display: 'flex', alignItems: 'center', gap: '16px' },
  bienvenida: { color: '#ccc', fontSize: '14px' },
  main: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
  acciones: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '24px',
  },
  subtitulo: { fontSize: '22px', color: '#1a1a2e' },
  botonesAccion: { display: 'flex', gap: '12px' },
  grilla: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  tarjeta: {
    background: 'white', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '2px solid transparent',
  },
  nombreGrupo: { fontSize: '18px', marginBottom: '8px', color: '#1a1a2e' },
  codigo: { fontSize: '13px', color: '#666', marginBottom: '8px' },
  miembros: { fontSize: '14px', color: '#444', marginBottom: '4px' },
  creador: { fontSize: '13px', color: '#888', marginTop: '8px' },
  vacio: {
    textAlign: 'center', padding: '60px', color: '#888',
    background: 'white', borderRadius: '12px',
  },
  mensaje: { textAlign: 'center', color: '#888' },
  error: { color: '#e74c3c', marginBottom: '16px', textAlign: 'center' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: 'white', borderRadius: '16px', padding: '32px',
    width: '100%', maxWidth: '380px',
  },
  modalTitulo: { marginBottom: '20px', fontSize: '18px', color: '#1a1a2e' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '12px 16px', borderRadius: '8px',
    border: '1.5px solid #ddd', fontSize: '15px',
  },
  modalBotones: { display: 'flex', gap: '10px', marginTop: '8px' },
  boton: {
    flex: 1, padding: '12px', background: '#0f3460', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  },
  botonSecundario: {
    flex: 1, padding: '12px', background: 'transparent', color: '#0f3460',
    border: '1.5px solid #0f3460', borderRadius: '8px', fontSize: '15px',
  },
}

export default Grupos