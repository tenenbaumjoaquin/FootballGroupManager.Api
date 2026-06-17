import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import logo from '../assets/logo.svg'
import fondo from '../assets/fondo.png'
import AvatarPreview from '../components/AvatarPreview'
import OpcionAvatar from '../components/OpcionAvatar'

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

const CATEGORIAS = [
  { key: 'cara',      label: 'CARA',      colorKey: 'colorPiel',  tieneColor: true  },
  { key: 'ojos',      label: 'OJOS',      colorKey: 'colorOjos',  tieneColor: true  },
  { key: 'pelo',      label: 'PELO',      colorKey: 'colorPelo',  tieneColor: true  },
  { key: 'barba',     label: 'BARBA',     colorKey: 'colorBarba', tieneColor: true  },
  { key: 'nariz',     label: 'NARIZ',     colorKey: null,         tieneColor: false },
  { key: 'boca',      label: 'BOCA',      colorKey: null,         tieneColor: false },
  { key: 'accesorio', label: 'ACCESORIO', colorKey: null,         tieneColor: false },
  { key: 'camiseta',  label: 'CAMISETA',  colorKey: null,         tieneColor: false },
]

const COLORES_PIEL = [
  // Tonos naturales claros
  '#FDDBB4', '#F5CBA7', '#F0C090', '#E8A87C',
  // Tonos naturales medios
  '#C68642', '#A0522D', '#8D5524', '#6B3A2A',
  // Tonos oscuros
  '#4A2C0A', '#3B1F0A',
]
const COLORES_PELO = [
  // Rubios y dorados
  '#F0C040', '#FFD700', '#F5E642', '#C8A951',
  // Marrones y castaños
  '#8B4513', '#A0522D', '#C8A97C', '#4A2C0A',
  // Negros y oscuros
  '#1a1a1a', '#2C2C2C',
  // Blancos y grises
  '#FFFFFF', '#E8E8E8', '#808080', '#C0C0C0',
  // Rojos
  '#CC0000', '#FF4444', '#8B0000', '#FF6B6B',
  // Azules anime
  '#1E90FF', '#0047AB', '#00BFFF', '#4169E1',
  // Verdes anime
  '#2ECC71', '#00FF7F', '#006400', '#7CFC00',
  // Violetas y rosas anime
  '#9B59B6', '#DA70D6', '#FF69B4', '#FF1493',
  '#8B008B', '#DDA0DD',
  // Naranjas anime
  '#FF6600', '#FF8C00', '#FFA500',
  // Turquesa/cian anime
  '#00CED1', '#40E0D0', '#00FFFF',
]
const COLORES_OJOS = [
  // Azules
  '#1E90FF', '#0047AB', '#00BFFF', '#4169E1', '#87CEEB',
  // Verdes
  '#2ECC71', '#00FF7F', '#006400', '#556a16', '#98FB98',
  // Marrones y ámbar
  '#8B4513', '#A0522D', '#D2691E', '#DAA520',
  // Negros y grises
  '#1a1a1a', '#2C2C2C', '#708090',
  // Rojos y rojizos anime
  '#E74C3C', '#CC0000', '#FF4444', '#8B0000',
  // Violetas anime
  '#9B59B6', '#8B008B', '#DA70D6', '#DDA0DD',
  // Rosas anime
  '#FF69B4', '#FF1493', '#FFB6C1',
  // Naranjas/dorados anime
  '#FFA500', '#FF8C00', '#DAA520', '#FFD700',
  // Turquesa/cian anime
  '#00CED1', '#40E0D0', '#00FFFF',
  // Blancos/plateados (personajes especiales)
  '#E8E8E8', '#C0C0C0',
]
const COLORES_BARBA = [
  // Rubios y dorados
  '#F0C040', '#FFD700', '#C8A951',
  // Marrones y castaños
  '#8B4513', '#A0522D', '#C8A97C', '#4A2C0A',
  // Negros y oscuros
  '#1a1a1a', '#2C2C2C',
  // Blancos y grises (barba envejecida)
  '#FFFFFF', '#E8E8E8', '#808080', '#C0C0C0',
  // Rojos
  '#CC0000', '#FF4444', '#8B0000',
  // Azules anime
  '#1E90FF', '#0047AB',
  // Violetas anime
  '#9B59B6', '#8B008B',
  // Naranjas anime
  '#FF6600', '#FFA500',
]
const FONDOS = [
  { key: 'gradiente_01', color: '#9B59B6' },
  { key: 'gradiente_02', color: '#0f3460' },
  { key: 'gradiente_03', color: '#2ecc71' },
  { key: 'gradiente_04', color: '#e74c3c' },
  { key: 'gradiente_05', color: '#f0c040' },
  { key: 'gradiente_06', color: '#333'    },
]

const OPCIONES = {
  cara:      ['cara_01', 'cara_02','cara_03','cara_04','cara_05','cara_06'],
  ojos:      ['ojos_01', 'ojos_02', 'ojos_03', 'ojos_04', 'ojos_05', 'ojos_06'],
  pelo:      ['ninguno','pelo_01', 'pelo_02', 'pelo_03', 'pelo_04', 'pelo_05', 'pelo_06', 'pelo_07', 'pelo_08', 'pelo_09'],
  barba:     ['ninguno', 'barba_01', 'barba_02', 'barba_03', 'barba_04', 'barba_05', 'barba_06', 'barba_07'],
  nariz:     ['nariz_01', 'nariz_02', 'nariz_03', 'nariz_04', 'nariz_05', 'nariz_06'],
  boca:      ['boca_01', 'boca_02', 'boca_03', 'boca_04', 'boca_05', 'boca_06'],
  accesorio: ['ninguno', 'accesorio_01', 'accesorio_02', 'accesorio_03'],
  camiseta:  [
    { id: 'camiseta_01', tieneColorSecundario: true  },
    { id: 'camiseta_02', tieneColorSecundario: false },
    { id: 'camiseta_03', tieneColorSecundario: true  },
    { id: 'camiseta_04', tieneColorSecundario: true },
    { id: 'camiseta_05', tieneColorSecundario: true },
  ],
}

// FIX: definidos a nivel módulo, igual que en EditarPerfil
const statsNombresCompletos = {
  VEL: 'VELOCIDAD', AGT: 'AGUANTE', PAS: 'PASE',   GMB: 'GAMBETA',
  DEF: 'DEFENSA',   FIS: 'FÍSICO',  PEG: 'PEGADA', TIR: 'TIRO',
  ATJ: 'ATAJADA',   REF: 'REFLEJO'
}

const statsNombresCortos = {
  VEL: 'VEL', AGT: 'AGT', PAS: 'PAS', GMB: 'GMB',
  DEF: 'DEF', FIS: 'FIS', PEG: 'PEG', TIR: 'TIR',
  ATJ: 'ATJ', REF: 'REF'
}

function Registro() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState('cara')

  const [form, setForm] = useState({
    nombreUsuario: '',
    email: '',
    password: '',
    nombre: '',
    posicion: '',
    avatar: {
      cara:                    'cara_01',
      colorPiel:               '#F5CBA7',
      ojos:                    'ojos_01',
      colorOjos:               '#1E90FF',
      pelo:                    'pelo_01',
      colorPelo:               '#4A2C0A',
      barba:                   'ninguno',
      colorBarba:              '#4A2C0A',
      nariz:                   'nariz_01',
      boca:                    'boca_01',
      accesorio:               'ninguno',
      camiseta:                'camiseta_01',
      colorCamisetaPrincipal:  '#282ed9',
      colorCamisetaSecundario: '#dbde0c',
      fondo:                   'gradiente_01',
    },
    stats: {
      VEL: 5, AGT: 5, PAS: 5, GMB: 5, DEF: 5,
      FIS: 5, PEG: 5, TIR: 5, ATJ: 5, REF: 5,
    }
  })

  const posiciones = [
    { valor: 'ARQ', label: 'ARQUERO',   numero: '1' },
    { valor: 'DEF', label: 'DEFENSOR',  numero: '2' },
    { valor: 'VOL', label: 'VOLANTE',   numero: '5' },
    { valor: 'DEL', label: 'DELANTERO', numero: '9' },
  ]

  // FIX: usa statsNombresCortos (nombre correcto) en lugar del inexistente statsNombres
  const radarData = Object.entries(form.stats).map(([key, val]) => ({
    stat: statsNombresCortos[key], valor: val, fullMark: 10
  }))

  const handleChange  = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleStat    = (stat, valor) => setForm({ ...form, stats:  { ...form.stats,  [stat]:  Number(valor) } })
  const handleAvatar  = (key, valor)  => setForm({ ...form, avatar: { ...form.avatar, [key]:   valor } })

  // FIX: agrega ...form.avatar para no pisar las keys que no se randomean
  const handleAleatorio = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
    setForm({
      ...form,
      avatar: {
        ...form.avatar,
        cara:                    rand(OPCIONES.cara),
        colorPiel:               rand(COLORES_PIEL),
        ojos:                    rand(OPCIONES.ojos),
        colorOjos:               rand(COLORES_OJOS),
        pelo:                    rand(OPCIONES.pelo),
        colorPelo:               rand(COLORES_PELO),
        barba:                   rand(OPCIONES.barba),
        colorBarba:              rand(COLORES_BARBA),
        nariz:                   rand(OPCIONES.nariz),
        boca:                    rand(OPCIONES.boca),
        camiseta:                rand(OPCIONES.camiseta).id,
        colorCamisetaPrincipal:  rand(COLORES_PELO),
        colorCamisetaSecundario: '#FFFFFF',
        fondo:                   rand(FONDOS).key,
      }
    })
  }

  const handleReiniciar = () => setForm({
    ...form,
    avatar: {
      cara:                    'cara_01',
      colorPiel:               '#F5CBA7',
      ojos:                    'ojos_01',
      colorOjos:               '#1E90FF',
      pelo:                    'pelo_01',
      colorPelo:               '#4A2C0A',
      barba:                   'ninguno',
      colorBarba:              '#4A2C0A',
      nariz:                   'nariz_01',
      boca:                    'boca_01',
      accesorio:               'ninguno',
      camiseta:                'camiseta_01',
      colorCamisetaPrincipal:  '#2012e1',
      colorCamisetaSecundario: '#f3e933',
      fondo:                   'gradiente_01',
    }
  })

  // FIX: no recibe evento — se llama desde onClick, igual que EditarPerfil
  const handleSubmit = async () => {
    setError('')
    setCargando(true)
    try {
      const res = await authService.registro(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify({
        id:            res.data.usuarioId,
        nombreUsuario: res.data.nombreUsuario,
        email:         res.data.email,
      }))
      navigate('/grupos')
    } catch (err) {
      const errores = err.response?.data?.errors
      if (errores) {
        setError(Object.values(errores).flat().join(' '))
      } else {
        setError(err.response?.data?.mensaje || 'ERROR AL REGISTRARSE.')
      }
    } finally {
      setCargando(false)
    }
  }

  const categoriaActual  = CATEGORIAS.find(c => c.key === categoriaActiva)
  const opcionesActuales = OPCIONES[categoriaActiva] || []
  const colorKeyActual   = categoriaActual?.colorKey

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${fondo})` }}>
      <img src={logo} alt="Sale Fulbo" style={styles.logo} />

      <div style={styles.cardWrapper}>
        <div style={styles.cardInner}>

          {/* Pasos */}
          <div style={styles.pasos}>
            {['1. CUENTA', '2. JUGADOR', '3. AVATAR', '4. STATS'].map((label, i) => (
              <div key={i} style={styles.pasoWrapper}>
                <div style={{
                  background: paso === i + 1 ? '#4cff4c' : '#fff',
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                  cursor: 'pointer',
                }} onClick={() => setPaso(i + 1)}>
                  <div style={{
                    margin: '2px',
                    background: paso === i + 1 ? '#1a7a1a' : '#000',
                    clipPath: 'polygon(5px 0%, calc(100% - 5px) 0%, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0% calc(100% - 5px), 0% 5px)',
                    padding: '6px 10px',
                    color: paso === i + 1 ? '#4cff4c' : '#fff',
                    fontSize: '9px',
                    fontFamily: "'Press Start 2P', cursive",
                    letterSpacing: '1px',
                  }}>
                    {label}
                  </div>
                </div>
                {i < 3 && <span style={styles.flecha}>➔</span>}
              </div>
            ))}
          </div>

          <h2 style={styles.titulo}>
            {paso === 1 && 'CREA TU CUENTA'}
            {paso === 2 && 'TU PERFIL'}
            {paso === 3 && 'TU AVATAR'}
            {paso === 4 && 'TUS STATS'}
          </h2>

          {error && <p style={styles.error}>{error}</p>}

          {/* PASO 1 — Cuenta */}
          {paso === 1 && (
            <div style={styles.form}>
              {[
                { label: 'NOMBRE DE USUARIO', name: 'nombreUsuario', type: 'text'     },
                { label: 'EMAIL',              name: 'email',         type: 'email'    },
                { label: 'CONTRASEÑA',         name: 'password',      type: 'password' },
              ].map(campo => (
                <div key={campo.name} style={styles.campo}>
                  <label style={styles.label}>{campo.label}</label>
                  <PixelBox>
                    <input style={styles.inputInner} type={campo.type}
                      name={campo.name} value={form[campo.name]}
                      onChange={handleChange} autoComplete="off" />
                  </PixelBox>
                </div>
              ))}
              <PixelBox style={{ innerBackground: '#1a7a1a' }}
                onClick={() => {
                  if (!form.nombreUsuario || !form.email || !form.password) {
                    setError('COMPLETÁ TODOS LOS CAMPOS.')
                    return
                  }
                  setError('')
                  setPaso(2)
                }}>
                <div style={styles.botonTexto}>SIGUIENTE &gt;</div>
              </PixelBox>
            </div>
          )}

          {/* PASO 2 — Jugador */}
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
                <div style={styles.posicionesGrid}>
                  {posiciones.map(p => (
                    <div key={p.valor}
                      onClick={() => setForm({ ...form, posicion: p.valor })}
                      style={{
                        ...styles.posicionBtn,
                        ...(form.posicion === p.valor ? styles.posicionBtnActivo : {})
                      }}>
                      <span style={styles.posicionNumero}>{p.numero}</span>
                      <span style={styles.posicionLabel}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.botonesPaso}>
                <PixelBox style={{ flex: 1 }} onClick={() => setPaso(1)}>
                  <div style={styles.botonTexto}>&lt; ATRAS</div>
                </PixelBox>
                <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}
                  onClick={() => {
                    if (!form.nombre || !form.posicion) {
                      setError('COMPLETÁ TODOS LOS CAMPOS.')
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

          {/* PASO 3 — Avatar */}
          {paso === 3 && (
            <>
              <div style={styles.avatarLayout}>
                <div style={styles.avatarCategorias}>
                  <p style={styles.avatarSeccionLabel}>— ROSTRO —</p>
                  {/* FIX: slice(0, 6) igual que EditarPerfil (incluye BOCA) */}
                  {CATEGORIAS.slice(0, 6).map(cat => (
                    <div key={cat.key}
                      onClick={() => setCategoriaActiva(cat.key)}
                      style={{ ...styles.categoriaItem, ...(categoriaActiva === cat.key ? styles.categoriaActiva : {}) }}>
                      {categoriaActiva === cat.key && <span style={styles.categoriaFlecha}>▶</span>}
                      <span style={styles.categoriaLabel}>{cat.label}</span>
                    </div>
                  ))}
                  <p style={{ ...styles.avatarSeccionLabel, marginTop: '12px' }}>— ESTILO —</p>
                  {CATEGORIAS.slice(6).map(cat => (
                    <div key={cat.key}
                      onClick={() => setCategoriaActiva(cat.key)}
                      style={{ ...styles.categoriaItem, ...(categoriaActiva === cat.key ? styles.categoriaActiva : {}) }}>
                      {categoriaActiva === cat.key && <span style={styles.categoriaFlecha}>▶</span>}
                      <span style={styles.categoriaLabel}>{cat.label}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.avatarCentro}>
                  <p style={styles.avatarSeccionLabel}>VISTA PREVIA</p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <AvatarPreview config={form.avatar} size={180} />
                  </div>
                  <p style={styles.avatarSeccionLabel}>FONDO</p>
                  <div style={styles.coloresGrid}>
                    {FONDOS.map(f => (
                      <div key={f.key}
                        onClick={() => handleAvatar('fondo', f.key)}
                        style={{
                          ...styles.colorCirculo,
                          background: f.color,
                          border: form.avatar.fondo === f.key ? '3px solid #4cff4c' : '2px solid #444',
                        }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <PixelBox style={{ flex: 1 }} onClick={handleAleatorio}>
                      <span style={styles.botonTextoXs}>🎲 ALEATORIO</span>
                    </PixelBox>
                    <PixelBox style={{ flex: 1 }} onClick={handleReiniciar}>
                      <span style={styles.botonTextoXs}>↺ REINICIAR</span>
                    </PixelBox>
                  </div>
                </div>

                <div style={styles.avatarOpciones}>
                  <p style={styles.avatarSeccionLabel}>{categoriaActual?.label}</p>
                  {/* FIX: un solo .map() sin anidado duplicado */}
                  <div style={styles.opcionesGrid}>
                    {opcionesActuales.map(op => {
                      const id = typeof op === 'object' ? op.id : op
                      return (
                        <div key={id}
                          onClick={() => handleAvatar(categoriaActiva, id)}
                          style={{
                            ...styles.opcionItem,
                            border: form.avatar[categoriaActiva] === id
                              ? '2px solid #4cff4c' : '2px solid #333',
                            background: form.avatar[categoriaActiva] === id ? '#1a7a1a' : '#111',
                            padding: 0,
                            overflow: 'hidden',
                          }}>
                          <OpcionAvatar categoria={categoriaActiva} id={id} />
                        </div>
                      )
                    })}
                  </div>

                  {colorKeyActual && (
                    <>
                      <p style={{ ...styles.avatarSeccionLabel, marginTop: '12px' }}>COLOR</p>
                      <div style={styles.coloresGrid}>
                        {(categoriaActiva === 'cara'  ? COLORES_PIEL
                          : categoriaActiva === 'ojos'  ? COLORES_OJOS
                          : categoriaActiva === 'barba' ? COLORES_BARBA
                          : COLORES_PELO
                        ).map(c => (
                          <div key={c}
                            onClick={() => handleAvatar(colorKeyActual, c)}
                            style={{
                              ...styles.colorCirculo,
                              background: c,
                              border: form.avatar[colorKeyActual] === c
                                ? '3px solid #4cff4c' : '2px solid #444',
                            }} />
                        ))}
                      </div>
                    </>
                  )}

                  {categoriaActiva === 'camiseta' && (() => {
                    const camisetaActual = OPCIONES.camiseta.find(c => c.id === form.avatar.camiseta)
                    return (
                      <>
                        <p style={{ ...styles.avatarSeccionLabel, marginTop: '12px' }}>COLOR PRINCIPAL</p>
                        <div style={styles.coloresGrid}>
                            {[
                                // básicos que ya tenías
                                '#CC0000', // rojo clásico
                                '#0000CC', // azul clásico
                                '#1a7a1a', // verde clásico
                                '#f0c040', // dorado/amarillo
                                '#FFFFFF', // blanco
                                '#000000', // negro
                                '#FF6600', // naranja
                                '#9B59B6', // violeta

                                // azules fútbol real
                                '#1E90FF', // azul brillante tipo Napoli/PSG alternativo
                                '#0B3D91', // azul profundo tipo Chelsea/Boca alternativo
                                '#002F6C', // azul oscuro clásico europeo

                                // celestes (muy importante para lo que pediste)
                                '#00AEEF', // celeste fuerte
                                '#6EC6FF', // celeste claro moderno
                                '#74C0FC', // celeste tipo selección Argentina/Uruguay variante

                                // verdes fútbol
                                '#2ECC71', // verde brillante moderno
                                '#006400', // verde oscuro clásico

                                // rojos/bordó
                                '#8B0000', // rojo oscuro
                                '#B22222', // rojo deportivo clásico
                                '#6D071A', // bordó tipo Roma/West Ham

                                // amarillos/dorados
                                '#FFD700', // dorado puro
                                '#F1C40F', // amarillo vivo clásico

                                // extras realistas de camisetas
                                '#2C3E50', // gris azulado tipo tercer uniforme
                                '#7F8C8D', // gris deportivo
                              ].map(c => (
                            <div key={c}
                              onClick={() => handleAvatar('colorCamisetaPrincipal', c)}
                              style={{
                                ...styles.colorCirculo,
                                background: c,
                                border: form.avatar.colorCamisetaPrincipal === c
                                  ? '3px solid #4cff4c' : '2px solid #444',
                              }} />
                          ))}
                        </div>
                        {camisetaActual?.tieneColorSecundario && (
                          <>
                            <p style={{ ...styles.avatarSeccionLabel, marginTop: '8px' }}>COLOR SECUNDARIO</p>
                            <div style={styles.coloresGrid}>
                              {[
                                // básicos que ya tenías
                                '#CC0000', // rojo clásico
                                '#0000CC', // azul clásico
                                '#1a7a1a', // verde clásico
                                '#f0c040', // dorado/amarillo
                                '#FFFFFF', // blanco
                                '#000000', // negro
                                '#FF6600', // naranja
                                '#9B59B6', // violeta

                                // azules fútbol real
                                '#1E90FF', // azul brillante tipo Napoli/PSG alternativo
                                '#0B3D91', // azul profundo tipo Chelsea/Boca alternativo
                                '#002F6C', // azul oscuro clásico europeo

                                // celestes (muy importante para lo que pediste)
                                '#00AEEF', // celeste fuerte
                                '#6EC6FF', // celeste claro moderno
                                '#74C0FC', // celeste tipo selección Argentina/Uruguay variante

                                // verdes fútbol
                                '#2ECC71', // verde brillante moderno
                                '#006400', // verde oscuro clásico

                                // rojos/bordó
                                '#8B0000', // rojo oscuro
                                '#B22222', // rojo deportivo clásico
                                '#6D071A', // bordó tipo Roma/West Ham

                                // amarillos/dorados
                                '#FFD700', // dorado puro
                                '#F1C40F', // amarillo vivo clásico

                                // extras realistas de camisetas
                                '#2C3E50', // gris azulado tipo tercer uniforme
                                '#7F8C8D', // gris deportivo
                              ].map(c => (
                                <div key={c}
                                  onClick={() => handleAvatar('colorCamisetaSecundario', c)}
                                  style={{
                                    ...styles.colorCirculo,
                                    background: c,
                                    border: form.avatar.colorCamisetaSecundario === c
                                      ? '3px solid #4cff4c' : '2px solid #444',
                                  }} />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>

              <div style={{ ...styles.botonesPaso, marginTop: '16px' }}>
                <PixelBox style={{ flex: 1 }} onClick={() => setPaso(2)}>
                  <div style={styles.botonTexto}>&lt; ATRAS</div>
                </PixelBox>
                <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }}
                  onClick={() => { setError(''); setPaso(4) }}>
                  <div style={styles.botonTexto}>SIGUIENTE &gt;</div>
                </PixelBox>
              </div>
            </>
          )}

          {/* PASO 4 — Stats */}
          {/* FIX: sin <form>, handleSubmit va en onClick igual que EditarPerfil */}
          {paso === 4 && (
            <div style={styles.form}>
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
                      <PolarAngleAxis dataKey="stat" tick={{ fill: '#4cff4c', fontSize: 9 }} />
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
                <PixelBox style={{ flex: 1 }} onClick={() => setPaso(3)}>
                  <div style={styles.botonTexto}>&lt; ATRAS</div>
                </PixelBox>
                <PixelBox style={{ flex: 1, innerBackground: '#1a7a1a' }} onClick={handleSubmit}>
                  <div style={styles.botonTexto}>
                    {cargando ? 'CREANDO...' : 'CREAR CUENTA >'}
                  </div>
                </PixelBox>
              </div>
            </div>
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
    width: '100%', maxWidth: '860px',
  },
  cardInner: {
    margin: '3px', background: '#000',
    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
    padding: '28px 32px',
  },
  pasos: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', marginBottom: '20px', flexWrap: 'wrap',
  },
  pasoWrapper: { display: 'flex', alignItems: 'center', gap: '6px' },
  flecha: { color: '#fff', fontSize: '14px' },
  titulo: {
    color: '#4cff4c', fontSize: '14px',
    letterSpacing: '2px', marginBottom: '20px',
    fontFamily: "'Press Start 2P', cursive",
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#4cff4c', fontSize: '9px', fontWeight: '700', letterSpacing: '1px' },
  inputInner: {
    background: 'transparent', border: 'none', color: '#fff',
    fontSize: '11px', outline: 'none', width: '100%',
    fontFamily: "'Press Start 2P', cursive",
  },
  error: { color: '#ff4c4c', fontSize: '10px', textAlign: 'center', marginBottom: '12px' },
  botonTexto: {
    color: '#fff', fontSize: '11px', fontWeight: '900',
    letterSpacing: '1px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive",
  },
  botonTextoXs: {
    color: '#fff', fontSize: '9px', fontWeight: '900',
    letterSpacing: '1px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive",
  },
  botonesPaso: { display: 'flex', gap: '12px', marginTop: '8px' },
  posicionesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  posicionBtn: {
    background: '#111', border: '2px solid #444',
    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
    padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
  },
  posicionBtnActivo: { background: '#1a7a1a', border: '2px solid #4cff4c' },
  posicionNumero: {
    color: '#f0c040', fontSize: '14px', fontWeight: '900',
    fontFamily: "'Press Start 2P', cursive", width: '24px', textAlign: 'center',
  },
  posicionLabel: {
    color: '#fff', fontSize: '9px', fontWeight: '700',
    letterSpacing: '1px', fontFamily: "'Press Start 2P', cursive",
  },
  avatarLayout: { display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '16px', minHeight: '380px' },
  avatarCategorias: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    borderRight: '2px solid #1a7a1a', paddingRight: '12px',
  },
  avatarSeccionLabel: {
    color: '#4cff4c', fontSize: '8px', letterSpacing: '1px',
    marginBottom: '4px', fontFamily: "'Press Start 2P', cursive",
  },
  categoriaItem: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px',
    cursor: 'pointer', color: '#888', fontSize: '9px',
    fontFamily: "'Press Start 2P', cursive", letterSpacing: '1px',
  },
  categoriaActiva: { color: '#4cff4c', background: 'rgba(26, 122, 26, 0.2)' },
  categoriaFlecha: { color: '#f0c040', fontSize: '10px' },
  categoriaLabel: { flex: 1 },
  avatarCentro: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    borderRight: '2px solid #1a7a1a', paddingRight: '12px',
  },
  avatarOpciones: { display: 'flex', flexDirection: 'column' },
  opcionesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' },
  opcionItem: {
    aspectRatio: '1', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer',
    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
    padding: '4px',
  },
  coloresGrid: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' },
  colorCirculo: { width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer' },
  statsLayout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  sliders: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  statRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  statLabel: { color: '#4cff4c', fontSize: '8px', fontWeight: '700', width: '68px' },
  slider: { flex: 1 },
  statValor: { color: '#f0c040', fontWeight: '900', fontSize: '12px', width: '18px', textAlign: 'center' },
  radar: { width: '260px', flexShrink: 0 },
  linkTexto: {
    textAlign: 'center', marginTop: '20px', color: '#fff',
    fontSize: '10px', fontWeight: '700', letterSpacing: '1px', lineHeight: '1.8',
    fontFamily: "'Press Start 2P', cursive",
  },
  link: { color: '#f0c040', textDecoration: 'none' },
}

export default Registro
