import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { grupoService, partidoService } from '../services/api'
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
    }}>
      {children}
    </div>
  </div>
)

const ESTADO_COLORS = {
  Abierto: '#4cff4c',
  Cerrado: '#f0c040',
  Jugado:  '#888',
}

const POSICION_LABEL = {
  ARQ: '🧤 ARQ',
  DEF: '🛡️ DEF',
  VOL: '⚙️ VOL',
  DEL: '⚡ DEL',
}

function Partido() {
  const { grupoId } = useParams()
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const [grupo, setGrupo] = useState(null)
  const [partido, setPartido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    try {
      const [resGrupo, resPartido] = await Promise.allSettled([
        grupoService.obtenerPorId(grupoId),
        partidoService.obtenerActivo(grupoId)
      ])
      if (resGrupo.status === 'fulfilled') setGrupo(resGrupo.value.data)
      if (resPartido.status === 'fulfilled') setPartido(resPartido.value.data)
    } catch {
      setError('ERROR AL CARGAR LOS DATOS.')
    } finally {
      setCargando(false)
    }
  }

  const handleCrearPartido = async () => {
    try {
      const res = await partidoService.crear(grupoId)
      setPartido(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL CREAR EL PARTIDO.')
    }
  }

  const handleConfirmar = async () => {
    try {
      const res = await partidoService.confirmar(partido.id)
      setPartido(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL CONFIRMAR.')
    }
  }

  const handleCancelar = async () => {
    try {
      const res = await partidoService.cancelar(partido.id)
      setPartido(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL CANCELAR.')
    }
  }

  const handleGenerarEquipos = async () => {
    try {
      const res = await partidoService.generarEquipos(partido.id)
      setPartido(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL GENERAR EQUIPOS.')
    }
  }

  const handleMarcarJugado = async () => {
    try {
      const res = await partidoService.marcarJugado(partido.id)
      setPartido(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL MARCAR COMO JUGADO.')
    }
  }

  const yoConfirme = partido?.jugadores.some(j => j.usuario.id === usuario?.id)
  const equipoA = partido?.jugadores.filter(j => j.equipoAsignado === 'A') || []
  const equipoB = partido?.jugadores.filter(j => j.equipoAsignado === 'B') || []
  const sinEquipo = partido?.jugadores.filter(j => !j.equipoAsignado) || []
  const puntajeA = equipoA.reduce((acc, j) => acc + j.usuario.puntajeTotal, 0).toFixed(2)
  const puntajeB = equipoB.reduce((acc, j) => acc + j.usuario.puntajeTotal, 0).toFixed(2)

  if (cargando) return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>
      <p style={styles.mensaje}>CARGANDO...</p>
    </div>
  )

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>

      {/* Header */}
      <div style={styles.header}>
        <PixelBox onClick={() => navigate('/grupos')}>
          <span style={styles.botonTextoSm}>&lt; VOLVER</span>
        </PixelBox>
        <div style={styles.headerCentro}>
          <span style={styles.headerNombre}>
            {grupo?.nombre?.toUpperCase()}
          </span>
          <span style={styles.headerCodigo}>
            COD: {grupo?.codigo}
          </span>
        </div>
        <div style={styles.headerMiembros}>
          <span style={styles.infoLabel}>MIEMBROS</span>
          <span style={styles.infoValor}>{(grupo?.miembros?.length || 0) + 1}</span>
        </div>
      </div>

      <div style={styles.contenido}>
        {error && <p style={styles.error}>{error}</p>}

        {/* Sin partido activo */}
        {!partido ? (
          <div style={styles.centrado}>
            <p style={styles.mensajeGrande}>NO HAY PARTIDO ACTIVO</p>
            <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={handleCrearPartido}>
              <span style={styles.botonTexto}>+ CREAR PARTIDO</span>
            </PixelBox>
          </div>
        ) : (
          <>
            {/* Estado bar */}
            <div style={styles.estadoBar}>
              <div style={styles.estadoIzq}>
                <span style={styles.estadoLabel}>ESTADO</span>
                <span style={{
                  ...styles.estadoBadge,
                  color: ESTADO_COLORS[partido.estado] || '#fff',
                  borderColor: ESTADO_COLORS[partido.estado] || '#fff',
                }}>
                  {partido.estado.toUpperCase()}
                </span>
              </div>
              <div style={styles.estadoDer}>
                <span style={styles.estadoLabel}>JUGADORES</span>
                <span style={styles.estadoContador}>
                  {partido.jugadores.length}
                  <span style={styles.estadoMax}>/10</span>
                </span>
              </div>
            </div>

            {/* Acciones */}
            {partido.estado === 'Abierto' && (
              <div style={styles.acciones}>
                {!yoConfirme ? (
                  <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={handleConfirmar}>
                    <span style={styles.botonTexto}>✔ CONFIRMAR ASISTENCIA</span>
                  </PixelBox>
                ) : (
                  <PixelBox style={{ innerBackground: '#7a1a1a' }} onClick={handleCancelar}>
                    <span style={styles.botonTexto}>✖ CANCELAR ASISTENCIA</span>
                  </PixelBox>
                )}
                {partido.jugadores.length === 10 && (
                  <PixelBox style={{ innerBackground: '#7a5a00' }} onClick={handleGenerarEquipos}>
                    <span style={styles.botonTexto}>⚡ GENERAR EQUIPOS</span>
                  </PixelBox>
                )}
              </div>
            )}

            {partido.estado === 'Cerrado' && (
              <div style={styles.acciones}>
                <PixelBox onClick={handleMarcarJugado}>
                  <span style={styles.botonTexto}>🏁 MARCAR COMO JUGADO</span>
                </PixelBox>
              </div>
            )}

            {/* Lista jugadores confirmados */}
            {partido.estado === 'Abierto' && (
              <div style={styles.seccion}>
                <h3 style={styles.seccionTitulo}>JUGADORES CONFIRMADOS</h3>
                {sinEquipo.length === 0 ? (
                  <p style={styles.mensajeVacio}>NADIE CONFIRMO TODAVIA</p>
                ) : (
                  <div style={styles.listaJugadores}>
                    {sinEquipo.map((pj, i) => (
                      <div key={i} style={styles.jugadorCardWrapper}>
                        <div style={styles.jugadorCardInner}>
                          <span style={styles.jugadorNombre}>
                            {pj.usuario.nombre.toUpperCase()}
                          </span>
                          <span style={styles.jugadorPos}>
                            {POSICION_LABEL[pj.usuario.posicion]}
                          </span>
                          <span style={styles.jugadorPuntaje}>
                            ★ {pj.usuario.puntajeTotal}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Equipos */}
            {(partido.estado === 'Cerrado' || partido.estado === 'Jugado') && (
              <div style={styles.equiposGrid}>
                {[
                  { letra: 'A', jugadores: equipoA, puntaje: puntajeA, color: '#4cff4c' },
                  { letra: 'B', jugadores: equipoB, puntaje: puntajeB, color: '#f0c040' },
                ].map(equipo => (
                  <div key={equipo.letra} style={styles.equipoWrapper}>
                    <div style={styles.equipoInner}>
                      <div style={{
                        ...styles.equipoHeader,
                        borderBottom: `3px solid ${equipo.color}`,
                      }}>
                        <span style={{ ...styles.equipoTitulo, color: equipo.color }}>
                          EQUIPO {equipo.letra}
                        </span>
                        <span style={{ ...styles.equipoPuntaje, color: equipo.color }}>
                          ★ {equipo.puntaje}
                        </span>
                      </div>
                      <div style={styles.listaJugadores}>
                        {equipo.jugadores.map((pj, i) => (
                          <div key={i} style={styles.jugadorCardWrapper}>
                            <div style={styles.jugadorCardInner}>
                              <span style={styles.jugadorNombre}>
                                {pj.usuario.nombre.toUpperCase()}
                              </span>
                              <span style={styles.jugadorPos}>
                                {POSICION_LABEL[pj.usuario.posicion]}
                              </span>
                              <span style={styles.jugadorPuntaje}>
                                ★ {pj.usuario.puntajeTotal}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
  },
  header: {
    background: 'rgba(0,0,0,0.9)',
    borderBottom: '3px solid #4cff4c',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerCentro: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  headerNombre: {
    color: '#f0c040',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  headerCodigo: {
    color: '#888',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  headerMiembros: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  contenido: {
    padding: '24px',
    maxWidth: '960px',
    margin: '0 auto',
    width: '100%',
  },
  error: {
    color: '#ff4c4c',
    fontSize: '10px',
    marginBottom: '16px',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  mensaje: {
    color: '#4cff4c',
    textAlign: 'center',
    fontSize: '12px',
    padding: '40px',
  },
  mensajeGrande: {
    color: '#4cff4c',
    fontSize: '14px',
    letterSpacing: '2px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  mensajeVacio: {
    color: '#555',
    fontSize: '10px',
    textAlign: 'center',
    padding: '20px',
    letterSpacing: '1px',
  },
  centrado: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '20px',
  },
  estadoBar: {
    background: 'rgba(0,0,0,0.85)',
    border: '2px solid #1a7a1a',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  estadoIzq: { display: 'flex', flexDirection: 'column', gap: '6px' },
  estadoDer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  estadoLabel: { color: '#4cff4c', fontSize: '9px', letterSpacing: '1px' },
  estadoBadge: {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    border: '2px solid',
    padding: '4px 10px',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
  },
  estadoContador: { color: '#fff', fontSize: '20px', fontWeight: '900' },
  estadoMax: { color: '#555', fontSize: '14px' },
  acciones: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  seccion: {
    background: 'rgba(0,0,0,0.85)',
    border: '2px solid #1a7a1a',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
    padding: '20px',
  },
  seccionTitulo: {
    color: '#4cff4c',
    fontSize: '11px',
    letterSpacing: '2px',
    marginBottom: '16px',
  },
  listaJugadores: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  jugadorCardWrapper: {
    background: '#4cff4c',
    clipPath: 'polygon(5px 0%, calc(100% - 5px) 0%, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0% calc(100% - 5px), 0% 5px)',
  },
  jugadorCardInner: {
    margin: '2px',
    background: '#111',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  jugadorNombre: {
    flex: 1,
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  jugadorPos: {
    color: '#4cff4c',
    fontSize: '9px',
    fontWeight: '700',
  },
  jugadorPuntaje: {
    color: '#f0c040',
    fontSize: '10px',
    fontWeight: '900',
  },
  equiposGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  equipoWrapper: {
    background: '#fff',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
  },
  equipoInner: {
    margin: '2px',
    background: '#000',
    clipPath: 'polygon(9px 0%, calc(100% - 9px) 0%, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0% calc(100% - 9px), 0% 9px)',
    padding: '0',
    overflow: 'hidden',
  },
  equipoHeader: {
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  equipoTitulo: {
    fontSize: '13px',
    fontWeight: '900',
    letterSpacing: '2px',
  },
  equipoPuntaje: {
    fontSize: '12px',
    fontWeight: '900',
  },
  infoLabel: { color: '#4cff4c', fontSize: '9px', letterSpacing: '1px' },
  infoValor: { color: '#fff', fontSize: '11px', fontWeight: '700' },
  botonTexto: {
    color: '#fff', fontSize: '11px',
    fontWeight: '900', letterSpacing: '1px',
    textAlign: 'center', cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonTextoSm: {
    color: '#fff', fontSize: '9px',
    fontWeight: '900', letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
}

export default Partido