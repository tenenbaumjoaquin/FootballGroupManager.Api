import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { grupoService, partidoService } from '../services/api'
import fondo from '../assets/fondo.png'
import AvatarPreview from '../components/AvatarPreview'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer
} from 'recharts' 

const PixelBox = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    position: 'relative',
    background: style.borderColor || '#fff',
    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>
    <div style={{
      margin: '2px',
      background: style.innerBackground || '#000',
      clipPath: 'polygon(5px 0%, calc(100% - 5px) 0%, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0% calc(100% - 5px), 0% 5px)',
      padding: style.padding || '10px 16px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  </div>
)

const POSICION_LABEL = {
  ARQ: 'ARQ', DEF: 'DEF', VOL: 'VOL', DEL: 'DEL'
}

const ESTADO_COLORS = {
  Abierto:    '#4cff4c',
  Cerrado:    '#f0c040',
  Jugado:     '#888',
  Suspendido: '#ff4c4c',
}

function Partido() {
  const { grupoId } = useParams()
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const [grupo, setGrupo] = useState(null)
  const [partido, setPartido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalDetalles, setModalDetalles] = useState(false)
  const [modalPerfil, setModalPerfil] = useState(null)
  const [detalles, setDetalles] = useState({
    direccion: '',
    fechaHora: '',
  })

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

  const handleGuardarDetalles = async () => {
    try {
      const res = await partidoService.actualizarDetalles(partido.id, {
        fechaHora: detalles.fechaHora ? new Date(detalles.fechaHora).toISOString() : null,
        direccion: detalles.direccion || null,
        latitud: null,
        longitud: null,
      })
      setPartido(res.data)
      setModalDetalles(false)
      setError('')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'ERROR AL GUARDAR DETALLES.')
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
          <span style={styles.headerNombre}>{grupo?.nombre?.toUpperCase()}</span>
          <span style={styles.headerCodigo}>COD: {grupo?.codigo}</span>
        </div>
        <div style={styles.headerDerecha}>
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
              <span style={styles.botonTexto}>+ ANUNCIAR PARTIDO</span>
            </PixelBox>
          </div>
        ) : (
          <div style={styles.layoutGrid}>

            {/* Columna izquierda — info partido */}
            <div style={styles.columnaIzq}>

              {/* Estado */}
              <div style={styles.estadoCard}>
                <div style={styles.estadoCardInner}>
                  <div style={styles.estadoRow}>
                    <span style={styles.infoLabel}>ESTADO</span>
                    <span style={{
                      ...styles.estadoBadge,
                      color: ESTADO_COLORS[partido.estado],
                      borderColor: ESTADO_COLORS[partido.estado],
                    }}>
                      {partido.estado.toUpperCase()}
                    </span>
                  </div>
                  <div style={styles.estadoRow}>
                    <span style={styles.infoLabel}>JUGADORES</span>
                    <span style={styles.contadorJugadores}>
                      {partido.jugadores.length}
                      <span style={{ color: '#555', fontSize: '14px' }}>/10</span>
                    </span>
                  </div>

                  {/* Fecha y hora */}
                  {partido.fechaHora && (
                    <div style={styles.estadoRow}>
                      <span style={styles.infoLabel}>FECHA</span>
                      <span style={styles.infoValor}>
                        {new Date(partido.fechaHora).toLocaleDateString('es-AR', {
                          day: '2-digit', month: '2-digit',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Dirección */}
                  {partido.direccion && (
                    <div style={{ ...styles.estadoRow, flexDirection: 'column', gap: '4px' }}>
                      <span style={styles.infoLabel}>LUGAR</span>
                      <span style={{ ...styles.infoValor, fontSize: '8px', lineHeight: '1.6' }}>
                        {partido.direccion}
                      </span>
                    </div>
                  )}
                </div>
              </div>

                {/* Acciones */}
                {partido.estado === 'Abierto' && (
                  <div style={styles.acciones}>
                    {!yoConfirme ? (
                      <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={handleConfirmar}>
                        <span style={styles.botonTexto}>✔ CONFIRMAR</span>
                      </PixelBox>
                    ) : (
                      <PixelBox style={{ innerBackground: '#7a1a1a' }} onClick={handleCancelar}>
                        <span style={styles.botonTexto}>✖ CANCELAR</span>
                      </PixelBox>
                    )}
                    <PixelBox onClick={() => {
                      setDetalles({
                        direccion: partido.direccion || '',
                        fechaHora: partido.fechaHora
                          ? new Date(partido.fechaHora).toISOString().slice(0, 16)
                          : '',
                      })
                      setModalDetalles(true)
                    }}>
                      <span style={styles.botonTexto}>📍 DETALLES</span>
                    </PixelBox>
                    {partido.jugadores.length === 10 && (
                      <PixelBox style={{ innerBackground: '#7a5a00' }} onClick={handleGenerarEquipos}>
                        <span style={styles.botonTexto}>⚡ GENERAR</span>
                      </PixelBox>
                    )}
                    <PixelBox style={{ innerBackground: '#7a1a1a' }} onClick={async () => {
                      try {
                        const res = await partidoService.suspender(partido.id)
                        setPartido(res.data)
                      } catch (err) {
                        setError(err.response?.data?.mensaje || 'ERROR AL SUSPENDER.')
                      }
                    }}>
                      <span style={styles.botonTexto}>⚠ SUSPENDER</span>
                    </PixelBox>
                  </div>
                )}

                {partido.estado === 'Cerrado' && (
                  <div style={styles.acciones}>
                    <PixelBox onClick={handleMarcarJugado}>
                      <span style={styles.botonTexto}>🏁 MARCAR JUGADO</span>
                    </PixelBox>
                    <PixelBox style={{ innerBackground: '#7a1a1a' }} onClick={async () => {
                      try {
                        const res = await partidoService.suspender(partido.id)
                        setPartido(res.data)
                      } catch (err) {
                        setError(err.response?.data?.mensaje || 'ERROR AL SUSPENDER.')
                      }
                    }}>
                      <span style={styles.botonTexto}>⚠ SUSPENDER</span>
                    </PixelBox>
                  </div>
                )}

              {/* Equipos generados */}
              {(partido.estado === 'Cerrado' || partido.estado === 'Jugado') && (
                <div style={styles.equiposGrid}>
                  {[
                    { letra: 'A', jugadores: equipoA, puntaje: puntajeA, color: '#4cff4c' },
                    { letra: 'B', jugadores: equipoB, puntaje: puntajeB, color: '#f0c040' },
                  ].map(equipo => (
                    <div key={equipo.letra} style={styles.equipoWrapper}>
                      <div style={styles.equipoInner}>
                        <div style={{ ...styles.equipoHeader, borderBottom: `2px solid ${equipo.color}` }}>
                          <span style={{ ...styles.equipoTitulo, color: equipo.color }}>
                            EQUIPO {equipo.letra}
                          </span>
                          <span style={{ color: equipo.color, fontSize: '11px', fontWeight: '900' }}>
                            ★ {equipo.puntaje}
                          </span>
                        </div>
                        {equipo.jugadores.map((pj, i) => (
                          <div key={i} style={styles.jugadorRow}>
                            <span style={styles.jugadorNombre}>{pj.usuario.nombre.toUpperCase()}</span>
                            <span style={styles.jugadorPos}>{POSICION_LABEL[pj.usuario.posicion]}</span>
                            <span style={styles.jugadorPuntaje}>★ {pj.usuario.puntajeTotal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Columna derecha — lista de miembros */}
            <div style={styles.columnaDer}>
              <div style={styles.miembrosCard}>
                <div style={styles.miembrosInner}>
                  <h3 style={styles.miembrosTitulo}>JUGADORES DEL GRUPO</h3>
                 {partido.miembros?.map((m, i) => (
                    <div key={i}
                      onClick={() => setModalPerfil(m)}
                      style={{
                        ...styles.miembroRow,
                        opacity: m.confirmado ? 1 : 0.45,
                        borderLeft: m.confirmado
                          ? '3px solid #4cff4c' : '3px solid #333',
                      }}>

                      {/* Avatar cuadrado */}
                      <div style={{
                        width: '54px',
                        height: '54px',
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        clipPath: 'polygon(4px 0%, calc(100% - 2px) 0%, 100% 4px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0% calc(100% - 2px), 0% 2px)',
                        background: '#111',
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '55%',
                          left: '50%',
                          transform: 'translate(-50%, -50%) scale(0.75)',
                          transformOrigin: 'center center',
                        }}>
                          <AvatarPreview config={m.avatar} size={70} />
                        </div>
                      </div>

                      <div style={styles.miembroInfo}>
                        <span style={styles.miembroNombre}>{m.nombre.toUpperCase()}</span>
                        <span style={styles.miembroPos}>{POSICION_LABEL[m.posicion]}</span>
                      </div>
                      <div style={styles.miembroDerecha}>
                        <span style={styles.miembroPuntaje}>★ {m.puntajeTotal}</span>
                        {m.confirmado && (
                          <span style={styles.confirmadoBadge}>✔</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal detalles del partido */}
      {modalDetalles && (
        <div style={styles.overlay}>
          <div style={styles.modalWrapper}>
            <div style={styles.modalInner}>
              <h3 style={styles.modalTitulo}>DETALLES DEL PARTIDO</h3>
              <div style={styles.form}>
                <div style={styles.campo}>
                  <label style={styles.label}>FECHA Y HORA</label>
                  <PixelBox>
                    <input
                      style={styles.inputInner}
                      type="datetime-local"
                      value={detalles.fechaHora}
                      onChange={e => setDetalles({ ...detalles, fechaHora: e.target.value })}
                    />
                  </PixelBox>
                </div>
                <div style={styles.campo}>
                  <label style={styles.label}>DIRECCIÓN</label>
                  <PixelBox>
                    <input
                      style={styles.inputInner}
                      type="text"
                      placeholder="Ej: Av. Corrientes 1234, CABA"
                      value={detalles.direccion}
                      onChange={e => setDetalles({ ...detalles, direccion: e.target.value })}
                    />
                  </PixelBox>
                </div>
                <div style={styles.modalBotones}>
                  <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}
                    onClick={handleGuardarDetalles}>
                    <span style={styles.botonTexto}>GUARDAR</span>
                  </PixelBox>
                  <PixelBox style={{ flex: 1 }} onClick={() => setModalDetalles(false)}>
                    <span style={styles.botonTexto}>CANCELAR</span>
                  </PixelBox>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* Modal perfil del jugador */}
    {modalPerfil && (
      <div style={styles.overlay} onClick={() => setModalPerfil(null)}>
        <div style={styles.modalWrapper} onClick={e => e.stopPropagation()}>
          <div style={styles.modalInner}>
            <h3 style={styles.modalTitulo}>{modalPerfil.nombre.toUpperCase()}</h3>
            <div style={styles.perfilLayout}>

              {/* Avatar */}
              <div style={{
                flexShrink: 0,
                overflow: 'hidden',
                clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
              }}>
                <AvatarPreview config={modalPerfil.avatar} size={200}/>
              </div>

              {/* Datos */}
              <div style={styles.perfilIzq}>
                <p style={styles.perfilPos}>{POSICION_LABEL[modalPerfil.posicion]}</p>
                <p style={styles.perfilCal}>{modalPerfil.calificacion}</p>
                <p style={styles.perfilPunt}>★ {modalPerfil.puntajeTotal}</p>
                <p style={styles.perfilUser}>@{modalPerfil.nombreUsuario}</p>
                {modalPerfil.confirmado && (
                  <p style={styles.confirmadoTexto}>✔ CONFIRMADO</p>
                )}
              </div>
                {/* Radar */}
                {modalPerfil.stats?.length > 0 && (
                  <div style={{ width: '200px', flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={modalPerfil.stats.map(s => ({
                        stat: s.nombre, valor: s.puntuacion, fullMark: 10
                      }))}
                        margin={{ top: 15, right: 20, bottom: 15, left: 20 }}>
                        <PolarGrid stroke="#2d6a2d" />
                        <PolarAngleAxis dataKey="stat"
                          tick={{ fill: '#4cff4c', fontSize: 7 }} />
                        <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar dataKey="valor" stroke="#f0c040"
                          fill="#f0c040" fillOpacity={0.4} />
                        <Tooltip contentStyle={{
                          background: '#000', border: '1px solid #4cff4c',
                          color: '#4cff4c', fontSize: '10px'
                        }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
            </div>
            <PixelBox style={{ marginTop: '16px' }} onClick={() => setModalPerfil(null)}>
              <span style={styles.botonTexto}>CERRAR</span>
            </PixelBox>
          </div>
        </div>
      </div>
    )}
    </div>
  )}

const styles = {
  container: {
    minHeight: '100vh', backgroundSize: 'cover',
    backgroundRepeat: 'repeat', display: 'flex', flexDirection: 'column',
  },
  header: {
    background: 'rgba(0,0,0,0.9)', borderBottom: '3px solid #4cff4c',
    padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px',
  },
  headerCentro: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '4px',
  },
  headerNombre: { color: '#f0c040', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' },
  headerCodigo: { color: '#888', fontSize: '9px', letterSpacing: '1px' },
  headerDerecha: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  contenido: { padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' },
  error: { color: '#ff4c4c', fontSize: '10px', marginBottom: '16px', textAlign: 'center' },
  mensaje: { color: '#4cff4c', textAlign: 'center', fontSize: '12px', padding: '40px' },
  mensajeGrande: {
    color: '#4cff4c', fontSize: '14px', letterSpacing: '2px',
    marginBottom: '24px', textAlign: 'center',
  },
  centrado: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '20px',
  },
  layoutGrid: {
    display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start',
  },
  columnaIzq: { display: 'flex', flexDirection: 'column', gap: '16px' },
  columnaDer: {},
  estadoCard: {
    background: '#fff',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
  },
  estadoCardInner: {
    margin: '2px', background: '#000',
    clipPath: 'polygon(7px 0%, calc(100% - 7px) 0%, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0% calc(100% - 7px), 0% 7px)',
    padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px',
  },
  estadoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  estadoBadge: {
    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
    border: '2px solid', padding: '4px 10px',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
  },
  contadorJugadores: { color: '#fff', fontSize: '20px', fontWeight: '900' },
  acciones: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  equiposGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  equipoWrapper: {
    background: '#fff',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
  },
  equipoInner: {
    margin: '2px', background: '#000',
    clipPath: 'polygon(7px 0%, calc(100% - 7px) 0%, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0% calc(100% - 7px), 0% 7px)',
    overflow: 'hidden',
  },
  equipoHeader: {
    padding: '12px 16px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px',
  },
  equipoTitulo: { fontSize: '12px', fontWeight: '900', letterSpacing: '2px' },
  jugadorRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 14px', borderTop: '1px solid #1a1a1a',
  },
  jugadorNombre: { flex: 1, color: '#fff', fontSize: '9px', fontWeight: '700' },
  jugadorPos: { color: '#4cff4c', fontSize: '8px', fontWeight: '700' },
  jugadorPuntaje: { color: '#f0c040', fontSize: '9px', fontWeight: '900' },
  miembrosCard: {
    background: '#fff',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
  },
  miembrosInner: {
    margin: '2px', background: '#000',
    clipPath: 'polygon(7px 0%, calc(100% - 7px) 0%, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0% calc(100% - 7px), 0% 7px)',
    padding: '16px',
  },
  miembrosTitulo: {
    color: '#4cff4c', fontSize: '10px', letterSpacing: '2px',
    marginBottom: '14px',
  },
  miembroRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 12px', marginBottom: '6px', background: '#111',
    cursor: 'pointer',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
  },
  miembroInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  miembroNombre: { color: '#fff', fontSize: '9px', fontWeight: '700', letterSpacing: '1px' },
  miembroPos: { color: '#4cff4c', fontSize: '8px' },
  miembroDerecha: { display: 'flex', alignItems: 'center', gap: '8px' },
  miembroPuntaje: { color: '#f0c040', fontSize: '10px', fontWeight: '900' },
  confirmadoBadge: {
    color: '#4cff4c', fontSize: '12px', fontWeight: '900',
  },
  perfilUser: { color: '#888', fontSize: '9px', letterSpacing: '1px' },

  infoLabel: { color: '#4cff4c', fontSize: '9px', letterSpacing: '1px' },
  infoValor: { color: '#fff', fontSize: '10px', fontWeight: '700' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modalWrapper: {
    background: '#fff',
    clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
    width: '100%',
    maxWidth: '560px',
  },
  modalInner: {
    margin: '3px', background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '28px',
  },
  modalTitulo: { color: '#4cff4c', fontSize: '13px', letterSpacing: '2px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#4cff4c', fontSize: '9px', fontWeight: '700', letterSpacing: '1px' },
  inputInner: {
    background: 'transparent', border: 'none', color: '#fff',
    fontSize: '11px', outline: 'none', width: '100%',
    fontFamily: "'Press Start 2P', cursive",
  },
  modalBotones: { display: 'flex', gap: '10px', marginTop: '8px' },
  perfilLayout: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  perfilIzq: { display: 'flex', flexDirection: 'column', gap: '8px' },
  perfilPos: { color: '#4cff4c', fontSize: '10px', letterSpacing: '1px' },
  perfilCal: { color: '#f0c040', fontSize: '20px', fontWeight: '900' },
  perfilPunt: { color: '#fff', fontSize: '12px' },
  confirmadoTexto: { color: '#4cff4c', fontSize: '9px', letterSpacing: '1px' },
  botonTexto: {
    color: '#fff', fontSize: '10px', fontWeight: '900',
    letterSpacing: '1px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive",
  },
  botonTextoSm: {
    color: '#fff', fontSize: '9px', fontWeight: '900',
    letterSpacing: '1px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive",
  },
}

export default Partido