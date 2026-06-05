import Cara from './avatar/Cara'
import Pelo from './avatar/Pelo'
import Ojos from './avatar/Ojos'
import Nariz from './avatar/Nariz'
import Boca from './avatar/Boca'
import Barba from './avatar/Barba'
import Camiseta from './avatar/Camiseta'
import Accesorio from './avatar/Accesorio'

const CONFIG_PREVIEW = {
  colorPiel: '#F5CBA7',
  colorOjos: '#1E90FF',
  colorPelo: '#4A2C0A',
  colorBarba: '#4A2C0A',
  colorCamisetaPrincipal: '#CC0000',
  colorCamisetaSecundario: '#FFFFFF',
}

const COMPONENTES = {
  cara:      (id) => <Cara tipo={id} colorPiel={CONFIG_PREVIEW.colorPiel} />,
  ojos:      (id) => <Ojos tipo={id} colorOjos={CONFIG_PREVIEW.colorOjos} colorCejas={CONFIG_PREVIEW.colorPelo} />,
  pelo:      (id) => <Pelo tipo={id} colorPelo={CONFIG_PREVIEW.colorPelo} />,
  barba:     (id) => <Barba tipo={id} colorBarba={CONFIG_PREVIEW.colorBarba} />,
  nariz:     (id) => <Nariz tipo={id} />,
  boca:      (id) => <Boca tipo={id} />,
  accesorio: (id) => <Accesorio tipo={id} />,
  camiseta:  (id) => <Camiseta tipo={id} colorPrincipal={CONFIG_PREVIEW.colorCamisetaPrincipal} colorSecundario={CONFIG_PREVIEW.colorCamisetaSecundario} />,
}

function OpcionAvatar({ categoria, id }) {
  const renderizar = COMPONENTES[categoria]
  if (!renderizar) return null

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      paddingBottom: '100%',
      background: '#1a1a1a',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
      }}>
        {renderizar(id)}
      </div>
    </div>
  )
}

export default OpcionAvatar