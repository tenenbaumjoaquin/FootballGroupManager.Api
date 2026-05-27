import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuarioService } from '../services/api'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import logo from '../assets/logo.png'
import fondo from '../assets/fondo.png'
import AvatarPreview from '../components/AvatarPreview'

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

const STATS_NOMBRES = {
  VEL: 'VELOCIDAD', AGT: 'AGUANTE', PAS: 'PASE',   GMB: 'GAMBETA',
  DEF: 'DEFENSA',   FIS: 'FÍSICO',  PEG: 'PEGADA', TIR: 'TIRO',
  ATJ: 'ATAJADA',   REF: 'REFLEJO'
}

const POSICION_LABEL = {
  ARQ: 'Arquero', DEF: 'Defensor',
  VOL: 'Volante', DEL: 'Delantero'
}

function Perfil() {
  const navigate = useNavigate()
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario'))
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalBorrar, setModalBorrar] = useState(false)

  useEffect(() => { cargarPerfil() }, [])

  const cargarPerfil = async () => {
    try {
      const res = await usuarioService.miPerfil()
      setUsuario(res.data)
    } catch {
      setError('ERROR AL CARGAR EL PERFIL.')
    } finally {
      setCargando(false)
    }
  }

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const handleBorrar = async () => {
    try {
      await usuarioService.eliminar()
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      navigate('/login')
    } catch {
      setError('ERROR AL ELIMINAR LA CUENTA.')
    }
  }

  const radarData = usuario?.stats?.map(s => ({
    stat: s.nombre,
    valor: s.puntuacion,
    fullMark: 10
  })) || []

  if (cargando) return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>
      <p style={styles.mensaje}>CARGANDO...</p>
    </div>
  )

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>

      {/* Header */}
      <div style={styles.header}>
        <img src={logo} alt="Sale Fulbo" style={styles.logoHeader} />
        <div style={styles.headerDerecha}>
          <div style={styles.usuarioInfo}>
            <span style={styles.nombreUsuario}>{usuarioLocal?.nombreUsuario?.toUpperCase()}</span>
            <PixelBox onClick={() => navigate('/grupos')}>
              <span style={styles.botonTextoSm}>&lt; VOLVER</span>
            </PixelBox>
          </div>
          <PixelBox onClick={handleCerrarSesion}>
            <span style={styles.botonTextoSm}>SALIR</span>
          </PixelBox>
        </div>
      </div>

      {/* Contenido */}
      <div style={styles.contenido}>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.cardWrapper}>
          <div style={styles.cardInner}>
            <div style={styles.layout}>

              {/* Columna izquierda — avatar */}
              <div style={styles.columnaIzq}>
                <div style={styles.avatarWrapper}>
                  <AvatarPreview config={usuario?.avatar} size={160} />
                </div>
                <p style={styles.avatarNombre}>{usuario?.nombre?.toUpperCase()}</p>
                <p style={styles.avatarPosicion}>
                  {POSICION_LABEL[usuario?.posicion]?.toUpperCase()}
                </p>
                <p style={styles.avatarCalificacion}>
                    {usuario?.calificacion} — {usuario?.puntajeTotal?.toFixed(2)}
                </p>
                <div style={styles.avatarBotones}>
                  <PixelBox style={{ flex: 1 }} onClick={() => navigate('/perfil/editar')}>
                    <span style={styles.botonTextoSm}>EDITAR</span>
                  </PixelBox>
                  <PixelBox style={{ flex: 1, borderColor: '#ff4c4c', innerBackground: '#7a1a1a' }}
                    onClick={() => setModalBorrar(true)}>
                    <span style={styles.botonTextoSm}>BORRAR</span>
                  </PixelBox>
                </div>
              </div>

              {/* Columna derecha */}
              <div style={styles.columnaDer}>

                {/* Datos del usuario */}
                <div style={styles.datosWrapper}>
                  <div style={styles.datosInner}>
                    {[
                      { label: 'USUARIO',    valor: usuario?.nombreUsuario },
                      { label: 'NOMBRE',     valor: usuario?.nombre },
                      { label: 'EMAIL',      valor: usuario?.email },
                      { label: 'CONTRASEÑA', valor: '••••••••' },
                    ].map(({ label, valor }) => (
                      <div key={label} style={styles.datoRow}>
                        <span style={styles.datoLabel}>{label}</span>
                        <span style={styles.datoValor}>{valor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                    {/* Stats + Radar */}
                    <div style={styles.statsRadarLayout}>

                    {/* Lista stats */}
                    <div style={styles.statsWrapper}>
                        <div style={styles.statsInner}>
                        {usuario?.stats?.map(s => (
                            <div key={s.nombre} style={styles.statRow}>
                            <span style={styles.statLabel}>
                                {STATS_NOMBRES[s.nombre]}:
                            </span>
                            <span style={styles.statValor}>{s.puntuacion}</span>
                            </div>
                        ))}
                        <div style={{ height: '4px' }} />
                        </div>
                    </div>

                  {/* Radar */}
                  <div style={styles.radarWrapper}>
                    <div style={styles.radarInner}>
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#2d6a2d" />
                          <PolarAngleAxis dataKey="stat"
                            tick={{ fill: '#4cff4c', fontSize: 8 }} />
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal borrar */}
      {modalBorrar && (
        <div style={styles.overlay}>
          <div style={styles.modalWrapper}>
            <div style={styles.modalInner}>
              <h3 style={styles.modalTitulo}>¿BORRAR CUENTA?</h3>
              <p style={styles.modalTexto}>
                ESTA ACCION ES IRREVERSIBLE. SE ELIMINARAN TODOS TUS DATOS.
              </p>
              <div style={styles.modalBotones}>
                <PixelBox style={{ flex: 1, borderColor: '#ff4c4c', innerBackground: '#7a1a1a' }}
                  onClick={handleBorrar}>
                  <span style={styles.botonTextoSm}>CONFIRMAR</span>
                </PixelBox>
                <PixelBox style={{ flex: 1 }} onClick={() => setModalBorrar(false)}>
                  <span style={styles.botonTextoSm}>CANCELAR</span>
                </PixelBox>
              </div>
            </div>
          </div>
        </div>
      )}
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
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoHeader: {
    height: '36px',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
  },
  headerDerecha: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  usuarioInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
  },
  nombreUsuario: {
    color: '#f0c040',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  contenido: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '28px 16px',
  },
  cardWrapper: {
    background: '#fff',
    clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
    width: '100%',
    maxWidth: '860px',
  },
  cardInner: {
    margin: '3px',
    background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '24px 28px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: '24px',
  },
  columnaIzq: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    borderRight: '2px solid #1a7a1a',
    paddingRight: '20px',
  },
  avatarWrapper: {
    background: '#fff',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
    padding: '3px',
  },
  avatarNombre: {
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textAlign: 'center',
  },
  avatarPosicion: {
    color: '#4cff4c',
    fontSize: '9px',
    letterSpacing: '1px',
    textAlign: 'center',
  },
  avatarCalificacion: {
    color: '#f0c040',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '2px',
    textAlign: 'center',
    marginTop: '2px',
  },
  avatarBotones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginTop: '8px',
  },
  columnaDer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  datosWrapper: {
    background: '#fff',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
  },
  datosInner: {
    margin: '2px',
    background: '#000',
    clipPath: 'polygon(7px 0%, calc(100% - 7px) 0%, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0% calc(100% - 7px), 0% 7px)',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  datoRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  datoLabel: {
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1px',
    width: '100px',
    flexShrink: 0,
  },
  datoValor: {
    color: '#fff',
    fontSize: '10px',
    letterSpacing: '1px',
  },
  statsRadarLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  statsWrapper: {
    background: '#fff',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
},
statsInner: {
    margin: '1px',
    background: '#000',
    clipPath: 'polygon(3px 0%, calc(100% - 3px) 0%, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0% calc(100% - 3px), 0% 3px)',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  statValor: {
    color: '#f0c040',
    fontSize: '10px',
    fontWeight: '900',
  },
  radarWrapper: {
    background: '#fff',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
  },
  radarInner: {
    margin: '2px',
    background: '#000',
    clipPath: 'polygon(7px 0%, calc(100% - 7px) 0%, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0% calc(100% - 7px), 0% 7px)',
    padding: '10px',
  },
  mensaje: {
    color: '#4cff4c',
    textAlign: 'center',
    fontSize: '12px',
    padding: '40px',
  },
  error: {
    color: '#ff4c4c',
    fontSize: '10px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalWrapper: {
    background: '#fff',
    clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
    width: '100%',
    maxWidth: '400px',
  },
  modalInner: {
    margin: '3px',
    background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '28px',
  },
  modalTitulo: {
    color: '#ff4c4c',
    fontSize: '13px',
    letterSpacing: '2px',
    marginBottom: '16px',
  },
  modalTexto: {
    color: '#aaa',
    fontSize: '9px',
    lineHeight: '1.8',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  modalBotones: {
    display: 'flex',
    gap: '10px',
  },
  botonTextoSm: {
    color: '#fff',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
}

export default Perfil