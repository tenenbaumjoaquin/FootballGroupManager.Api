import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { grupoService } from '../services/api'
import logo from '../assets/logo.png'
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
          <span style={styles.bienvenida}>⚽ {usuario?.nombreUsuario?.toUpperCase()}</span>
          <PixelBox onClick={handleCerrarSesion}>
            <span style={styles.botonTextoSm}>SALIR</span>
          </PixelBox>
        </div>
      </div>

      {/* Contenido */}
      <div style={styles.contenido}>

        {/* Titulo y acciones */}
        <div style={styles.topBar}>
          <h2 style={styles.titulo}>MIS GRUPOS</h2>
          <div style={styles.acciones}>
            <PixelBox style={{ innerBackground: '#1a7a1a' }} onClick={() => setModalCrear(true)}>
              <span style={styles.botonTexto}>+ CREAR</span>
            </PixelBox>
            <PixelBox onClick={() => setModalUnirse(true)}>
              <span style={styles.botonTexto}>UNIRSE</span>
            </PixelBox>
          </div>
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
          <div style={styles.grilla}>
            {grupos.map(grupo => (
              <div key={grupo.id}
                onClick={() => navigate(`/grupos/${grupo.id}/partido`)}
                style={styles.tarjetaWrapper}>
                <div style={styles.tarjetaInner}>
                  <h3 style={styles.nombreGrupo}>{grupo.nombre.toUpperCase()}</h3>
                  <div style={styles.tarjetaDivider} />
                  <p style={styles.tarjetaInfo}>
                    <span style={styles.infoLabel}>CODIGO</span>
                    <span style={styles.infoValor}>{grupo.codigo}</span>
                  </p>
                  <p style={styles.tarjetaInfo}>
                    <span style={styles.infoLabel}>JUGADORES</span>
                    <span style={styles.infoValor}>{grupo.miembros.length + 1}</span>
                  </p>
                  <p style={styles.tarjetaInfo}>
                    <span style={styles.infoLabel}>CREADOR</span>
                    <span style={{
                      ...styles.infoValor,
                      color: grupo.creador.nombreUsuario === usuario?.nombreUsuario
                        ? '#f0c040' : '#fff'
                    }}>
                      {grupo.creador.nombreUsuario === usuario?.nombreUsuario
                        ? '★ VOS' : grupo.creador.nombreUsuario.toUpperCase()}
                    </span>
                  </p>
                  <div style={styles.entrarBtn}>ENTRAR &gt;</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear */}
      {modalCrear && (
        <div style={styles.overlay}>
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
        <div style={styles.overlay}>
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
    background: 'rgba(0,0,0,0.85)',
    borderBottom: '3px solid #4cff4c',
    padding: '12px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoHeader: {
    height: '40px',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
  },
  headerDerecha: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  bienvenida: {
    color: '#4cff4c',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  contenido: {
    padding: '28px 32px',
    maxWidth: '960px',
    margin: '0 auto',
    width: '100%',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  titulo: {
    color: '#4cff4c',
    fontSize: '16px',
    letterSpacing: '2px',
  },
  acciones: {
    display: 'flex',
    gap: '12px',
  },
  grilla: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  tarjetaWrapper: {
    background: '#fff',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    cursor: 'pointer',
  },
  tarjetaInner: {
    margin: '2px',
    background: '#000',
    clipPath: 'polygon(9px 0%, calc(100% - 9px) 0%, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0% calc(100% - 9px), 0% 9px)',
    padding: '20px',
  },
  nombreGrupo: {
    color: '#f0c040',
    fontSize: '13px',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  tarjetaDivider: {
    height: '2px',
    background: '#1a7a1a',
    marginBottom: '12px',
  },
  tarjetaInfo: {
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
    padding: '60px 20px',
  },
  vacioPrin: {
    color: '#4cff4c',
    fontSize: '12px',
    marginBottom: '12px',
    letterSpacing: '1px',
  },
  vacioSub: {
    color: '#888',
    fontSize: '10px',
    letterSpacing: '1px',
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
    marginBottom: '16px',
    textAlign: 'center',
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
    fontSize: '14px',
    letterSpacing: '2px',
    marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: {
    color: '#4cff4c', fontSize: '10px',
    fontWeight: '700', letterSpacing: '1px',
  },
  inputInner: {
    background: 'transparent', border: 'none',
    color: '#fff', fontSize: '11px',
    outline: 'none', width: '100%',
    fontFamily: "'Press Start 2P', cursive",
  },
  modalBotones: { display: 'flex', gap: '10px', marginTop: '8px' },
  botonTexto: {
    color: '#fff', fontSize: '11px',
    fontWeight: '900', letterSpacing: '1px',
    textAlign: 'center', cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonTextoSm: {
    color: '#fff', fontSize: '10px',
    fontWeight: '900', letterSpacing: '1px',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', cursive",
  },
  botonSubmit: {
    background: 'transparent', border: 'none',
    color: '#fff', fontSize: '11px',
    fontWeight: '900', letterSpacing: '1px',
    cursor: 'pointer', width: '100%',
    textAlign: 'center',
    fontFamily: "'Press Start 2P', cursive",
  },
}

export default Grupos