import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { grupoService } from '../services/api'
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

  useEffect(() => { cargarGrupos() }, [])

  const cargarGrupos = async () => {
    try {
      const res = await grupoService.misGrupos()
      setGrupos(res.data)
    } catch {
      setError('ERROR AL CARGAR LOS GRUPOS.')
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
      setError(err.response?.data?.mensaje || 'ERROR AL CREAR EL GRUPO.')
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
      setError(err.response?.data?.mensaje || 'ERROR AL UNIRSE AL GRUPO.')
    }
  }

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>

      {/* Header */}
      <div style={styles.header}>
        <img src={logo} alt="Sale Fulbo" style={styles.logoHeader} />
        <div style={styles.headerDerecha}>
          <div style={styles.usuarioInfo}>
            <span style={styles.nombreUsuario}>{usuario?.nombreUsuario?.toUpperCase()}</span>
            <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={() => navigate('/perfil')}>
              <span style={styles.botonTextoSm}>PERFIL</span>
            </PixelBox>
          </div>
          <PixelBox onClick={handleCerrarSesion}>
            <span style={styles.botonTextoSm}>SALIR</span>
          </PixelBox>
        </div>
      </div>

      {/* Area central con overlay */}
      <div style={styles.areaContenido}>
        <div style={styles.overlay}>

          {/* Botones crear y unirse */}
          <div style={styles.acciones}>
            <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={() => setModalCrear(true)}>
              <span style={styles.botonTexto}>+ CREAR</span>
            </PixelBox>
            <PixelBox onClick={() => setModalUnirse(true)}>
              <span style={styles.botonTexto}>UNIRSE</span>
            </PixelBox>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {cargando ? (
            <p style={styles.mensaje}>CARGANDO...</p>
          ) : grupos.length === 0 ? (
            <div style={styles.vacio}>
              <p style={styles.vacioPrin}>NO PERTENECES A NINGUN GRUPO</p>
              <p style={styles.vacioSub}>CREA UNO O UNITE CON UN CODIGO</p>
            </div>
          ) : (
            <div style={styles.listaGrupos}>
              {grupos.map(grupo => (
                <div key={grupo.id}
                  onClick={() => navigate(`/grupos/${grupo.id}/partido`)}
                  style={styles.tarjetaWrapper}>
                  <div style={styles.tarjetaInner}>
                    <h3 style={styles.nombreGrupo}>{grupo.nombre.toUpperCase()}</h3>
                    <div style={styles.tarjetaDivider} />
                    <div style={styles.tarjetaInfoRow}>
                      <span style={styles.infoLabel}>CODIGO</span>
                      <span style={styles.infoValor}>{grupo.codigo}</span>
                    </div>
                    <div style={styles.tarjetaInfoRow}>
                      <span style={styles.infoLabel}>JUGADORES</span>
                      <span style={styles.infoValor}>{grupo.miembros.length + 1}</span>
                    </div>
                    <div style={styles.tarjetaInfoRow}>
                      <span style={styles.infoLabel}>CREADOR</span>
                      <span style={{
                        ...styles.infoValor,
                        color: grupo.creador.nombreUsuario === usuario?.nombreUsuario
                          ? '#f0c040' : '#fff'
                      }}>
                        {grupo.creador.nombreUsuario === usuario?.nombreUsuario
                          ? '★ VOS' : grupo.creador.nombreUsuario.toUpperCase()}
                      </span>
                    </div>
                    <div style={styles.entrarBtn}>ENTRAR &gt;</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear */}
      {modalCrear && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalWrapper}>
            <div style={styles.modalInner}>
              <h3 style={styles.modalTitulo}>CREAR GRUPO</h3>
              <form onSubmit={handleCrear} style={styles.form}>
                <label style={styles.label}>NOMBRE DEL GRUPO</label>
                <PixelBox>
                  <input style={styles.inputInner} type="text"
                    value={nombreGrupo}
                    onChange={e => setNombreGrupo(e.target.value)}
                    required />
                </PixelBox>
                <div style={styles.modalBotones}>
                  <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}>
                    <button type="submit" style={styles.botonSubmit}>CREAR</button>
                  </PixelBox>
                  <PixelBox style={{ flex: 1 }} onClick={() => setModalCrear(false)}>
                    <span style={styles.botonTexto}>CANCELAR</span>
                  </PixelBox>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Unirse */}
      {modalUnirse && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalWrapper}>
            <div style={styles.modalInner}>
              <h3 style={styles.modalTitulo}>UNIRSE A GRUPO</h3>
              <form onSubmit={handleUnirse} style={styles.form}>
                <label style={styles.label}>CODIGO DEL GRUPO</label>
                <PixelBox>
                  <input style={styles.inputInner} type="text"
                    value={codigoGrupo}
                    onChange={e => setCodigoGrupo(e.target.value.toUpperCase())}
                    placeholder="EJ: C7G3A7"
                    required />
                </PixelBox>
                <div style={styles.modalBotones}>
                  <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}>
                    <button type="submit" style={styles.botonSubmit}>UNIRSE</button>
                  </PixelBox>
                  <PixelBox style={{ flex: 1 }} onClick={() => setModalUnirse(false)}>
                    <span style={styles.botonTexto}>CANCELAR</span>
                  </PixelBox>
                </div>
              </form>
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
  areaContenido: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  overlay: {
    background: 'rgba(184, 118, 17, 0.55)',
    width: '100%',
    maxWidth: '500px',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    minHeight: '100%',
  },
  acciones: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
    alignSelf: 'flex-end',
  },
  listaGrupos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  tarjetaWrapper: {
    background: '#fff',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    cursor: 'pointer',
    width: '100%',
  },
  tarjetaInner: {
    margin: '2px',
    background: '#000',
    clipPath: 'polygon(9px 0%, calc(100% - 9px) 0%, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0% calc(100% - 9px), 0% 9px)',
    padding: '18px 20px',
  },
  nombreGrupo: {
    color: '#f0c040',
    fontSize: '12px',
    letterSpacing: '1px',
    marginBottom: '12px',
    lineHeight: '1.6',
  },
  tarjetaDivider: {
    height: '2px',
    background: '#1a7a1a',
    marginBottom: '12px',
  },
  tarjetaInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  infoLabel: {
    color: '#4cff4c',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  infoValor: {
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
  },
  entrarBtn: {
    color: '#4cff4c',
    fontSize: '10px',
    fontWeight: '700',
    textAlign: 'right',
    marginTop: '12px',
    letterSpacing: '1px',
  },
  vacio: {
    textAlign: 'center',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  vacioPrin: {
    color: '#4cff4c',
    fontSize: '11px',
    letterSpacing: '1px',
    lineHeight: '1.8',
  },
  vacioSub: {
    color: '#ffffff',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  mensaje: {
    color: '#4cff4c',
    fontSize: '11px',
    padding: '40px',
    letterSpacing: '1px',
  },
  error: {
    color: '#ff4c4c',
    fontSize: '10px',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  modalOverlay: {
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
    maxWidth: '380px',
  },
  modalInner: {
    margin: '3px',
    background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '28px',
  },
  modalTitulo: {
    color: '#4cff4c',
    fontSize: '13px',
    letterSpacing: '2px',
    marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: {
    color: '#4cff4c',
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '1px',
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
  modalBotones: { display: 'flex', gap: '10px', marginTop: '8px' },
  botonTexto: {
    color: '#fff',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1px',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonTextoSm: {
    color: '#fff',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonSubmit: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
    fontFamily: "'Press Start 2P', cursive",
  },
}

export default Grupos