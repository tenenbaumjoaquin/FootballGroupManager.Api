import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { grupoService, partidoService } from '../services/api'

function Partido() {
  const { grupoId } = useParams()
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const [grupo, setGrupo] = useState(null)
  const [partido, setPartido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [resGrupo, resPartido] = await Promise.allSettled([
        grupoService.obtenerPorId(grupoId),
        partidoService.obtenerActivo(grupoId)
      ])
      if (resGrupo.status === 'fulfilled') setGrupo(resGrupo.value.data)
      if (resPartido.status === 'fulfilled') setPartido(resPartido.value.data)
    } catch {
      setError('Error al cargar los datos.')
    } finally {
      setCargando(false)
    }
  }

  const handleCrearPartido = async () => {
    try {
      const res = await partidoService.crear(grupoId)
      setPartido(res.data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear el partido.')
    }
  }

  const handleConfirmar = async () => {
    try {
      const res = await partidoService.confirmar(partido.id)
      setPartido(res.data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al confirmar asistencia.')
    }
  }

  const handleCancelar = async () => {
    try {
      const res = await partidoService.cancelar(partido.id)
      setPartido(res.data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cancelar asistencia.')
    }
  }

  const handleGenerarEquipos = async () => {
    try {
      const res = await partidoService.generarEquipos(partido.id)
      setPartido(res.data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al generar equipos.')
    }
  }

  const handleMarcarJugado = async () => {
    try {
      const res = await partidoService.marcarJugado(partido.id)
      setPartido(res.data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al marcar como jugado.')
    }
  }

  const yoConfirme = partido?.jugadores.some(j => j.usuario.id === usuario?.id)
  const equipoA = partido?.jugadores.filter(j => j.equipoAsignado === 'A') || []
  const equipoB = partido?.jugadores.filter(j => j.equipoAsignado === 'B') || []
  const sinEquipo = partido?.jugadores.filter(j => !j.equipoAsignado) || []

  if (cargando) return <p style={styles.mensaje}>Cargando...</p>

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.volver} onClick={() => navigate('/grupos')}>
          ← Volver
        </button>
        <h1 style={styles.titulo}>{grupo?.nombre}</h1>
        <span style={styles.codigo}>Código: {grupo?.codigo}</span>
      </header>

      <main style={styles.main}>
        {error && <p style={styles.error}>{error}</p>}

        {!partido ? (
          <div style={styles.vacio}>
            <p style={styles.vaciomensaje}>No hay ningún partido activo en este grupo.</p>
            <button style={styles.boton} onClick={handleCrearPartido}>
              + Crear partido
            </button>
          </div>
        ) : (
          <>
            {/* Estado del partido */}
            <div style={styles.estadoBar}>
              <span style={{
                ...styles.estadoBadge,
                background: partido.estado === 'Abierto' ? '#27ae60'
                  : partido.estado === 'Cerrado' ? '#e67e22' : '#95a5a6'
              }}>
                {partido.estado === 'Abierto' ? '🟢 Abierto'
                  : partido.estado === 'Cerrado' ? '🟠 Equipos generados'
                  : '⚫ Jugado'}
              </span>
              <span style={styles.contador}>
                {partido.jugadores.length}/10 jugadores
              </span>
            </div>

            {/* Acciones según estado */}
            {partido.estado === 'Abierto' && (
              <div style={styles.acciones}>
                {!yoConfirme ? (
                  <button style={styles.boton} onClick={handleConfirmar}>
                    ✅ Confirmar asistencia
                  </button>
                ) : (
                  <button style={styles.botonPeligro} onClick={handleCancelar}>
                    ❌ Cancelar asistencia
                  </button>
                )}
                {partido.jugadores.length === 10 && (
                  <button style={styles.botonDestacado} onClick={handleGenerarEquipos}>
                    ⚡ Generar equipos
                  </button>
                )}
              </div>
            )}

            {partido.estado === 'Cerrado' && (
              <div style={styles.acciones}>
                <button style={styles.botonSecundario} onClick={handleMarcarJugado}>
                  🏁 Marcar como jugado
                </button>
              </div>
            )}

            {/* Lista de jugadores confirmados */}
            {partido.estado === 'Abierto' && (
              <div style={styles.seccion}>
                <h3 style={styles.seccionTitulo}>
                  Jugadores confirmados ({partido.jugadores.length}/10)
                </h3>
                {sinEquipo.length === 0 ? (
                  <p style={styles.vacioPequeno}>Nadie confirmó todavía.</p>
                ) : (
                  <div style={styles.listaJugadores}>
                    {sinEquipo.map((pj, i) => (
                      <div key={i} style={styles.jugadorCard}>
                        <span style={styles.jugadorNombre}>{pj.usuario.nombre}</span>
                        <span style={styles.jugadorPos}>{pj.usuario.posicion}</span>
                        <span style={styles.jugadorPuntaje}>⭐ {pj.usuario.puntajeTotal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Equipos generados */}
            {(partido.estado === 'Cerrado' || partido.estado === 'Jugado') && (
              <div style={styles.equipos}>
                <div style={styles.equipo}>
                  <h3 style={{ ...styles.equipoTitulo, background: '#1a1a2e' }}>
                    Equipo A
                  </h3>
                  <div style={styles.listaJugadores}>
                    {equipoA.map((pj, i) => (
                      <div key={i} style={styles.jugadorCard}>
                        <span style={styles.jugadorNombre}>{pj.usuario.nombre}</span>
                        <span style={styles.jugadorPos}>{pj.usuario.posicion}</span>
                        <span style={styles.jugadorPuntaje}>⭐ {pj.usuario.puntajeTotal}</span>
                      </div>
                    ))}
                  </div>
                  <p style={styles.puntajeTotal}>
                    Puntaje total: {equipoA.reduce((acc, pj) => acc + pj.usuario.puntajeTotal, 0).toFixed(2)}
                  </p>
                </div>

                <div style={styles.equipo}>
                  <h3 style={{ ...styles.equipoTitulo, background: '#0f3460' }}>
                    Equipo B
                  </h3>
                  <div style={styles.listaJugadores}>
                    {equipoB.map((pj, i) => (
                      <div key={i} style={styles.jugadorCard}>
                        <span style={styles.jugadorNombre}>{pj.usuario.nombre}</span>
                        <span style={styles.jugadorPos}>{pj.usuario.posicion}</span>
                        <span style={styles.jugadorPuntaje}>⭐ {pj.usuario.puntajeTotal}</span>
                      </div>
                    ))}
                  </div>
                  <p style={styles.puntajeTotal}>
                    Puntaje total: {equipoB.reduce((acc, pj) => acc + pj.usuario.puntajeTotal, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    padding: '16px 32px', display: 'flex',
    alignItems: 'center', gap: '20px',
  },
  volver: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
    color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '14px',
  },
  titulo: { color: 'white', fontSize: '20px', flex: 1 },
  codigo: { color: '#aaa', fontSize: '13px' },
  main: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
  error: { color: '#e74c3c', marginBottom: '16px', textAlign: 'center' },
  mensaje: { textAlign: 'center', padding: '60px', color: '#888' },
  vacio: {
    textAlign: 'center', padding: '60px', background: 'white',
    borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  vaciomensaje: { color: '#888', marginBottom: '24px', fontSize: '16px' },
  vacioPequeno: { color: '#aaa', fontSize: '14px', padding: '16px 0' },
  estadoBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '24px', background: 'white', padding: '16px 20px',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  estadoBadge: {
    color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '14px',
  },
  contador: { color: '#444', fontWeight: '600', fontSize: '15px' },
  acciones: { display: 'flex', gap: '12px', marginBottom: '24px' },
  seccion: {
    background: 'white', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  seccionTitulo: { fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' },
  equipos: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  equipo: {
    background: 'white', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  equipoTitulo: {
    color: 'white', padding: '14px 20px', fontSize: '16px', fontWeight: '600',
  },
  listaJugadores: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  jugadorCard: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', background: '#f8f9fa', borderRadius: '8px',
  },
  jugadorNombre: { flex: 1, fontWeight: '500', fontSize: '14px' },
  jugadorPos: {
    fontSize: '12px', background: '#e8f4fd', color: '#0f3460',
    padding: '3px 8px', borderRadius: '12px', fontWeight: '600',
  },
  jugadorPuntaje: { fontSize: '13px', color: '#666' },
  puntajeTotal: {
    padding: '12px 20px', borderTop: '1px solid #eee',
    fontSize: '14px', fontWeight: '600', color: '#444', textAlign: 'right',
  },
  boton: {
    padding: '12px 24px', background: '#0f3460', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  },
  botonDestacado: {
    padding: '12px 24px', background: '#27ae60', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  },
  botonPeligro: {
    padding: '12px 24px', background: '#e74c3c', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
  },
  botonSecundario: {
    padding: '12px 24px', background: 'transparent', color: '#0f3460',
    border: '1.5px solid #0f3460', borderRadius: '8px', fontSize: '15px',
  },
}

export default Partido