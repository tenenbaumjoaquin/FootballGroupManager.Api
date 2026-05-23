import Cara from './avatar/Cara'
import Pelo from './avatar/Pelo'
import Ojos from './avatar/Ojos'
import Nariz from './avatar/Nariz'
import Boca from './avatar/Boca'
import Barba from './avatar/Barba'
import Camiseta from './avatar/Camiseta'

const FONDOS = {
  gradiente_01: 'linear-gradient(135deg, #6B2FA0, #9B59B6)',
  gradiente_02: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
  gradiente_03: 'linear-gradient(135deg, #1a7a1a, #2ecc71)',
  gradiente_04: 'linear-gradient(135deg, #7a1a1a, #e74c3c)',
  gradiente_05: 'linear-gradient(135deg, #7a6a00, #f0c040)',
  gradiente_06: 'linear-gradient(135deg, #000, #333)',
}

function AvatarPreview({ config, size = 200 }) {
  const fondo = FONDOS[config?.fondo] || FONDOS.gradiente_01
  const width = size * (54 / 80)
  const height = size

  return (
    <div style={{
      width: width,
      height: height,
      background: fondo,
      position: 'relative',
      overflow: 'hidden',
      clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
      flexShrink: 0,
    }}>
      <Camiseta
        tipo={config?.camiseta}
        colorPrincipal={config?.colorCamisetaPrincipal}
        colorSecundario={config?.colorCamisetaSecundario}
      />
      <Cara tipo={config?.cara} colorPiel={config?.colorPiel} />
      <Ojos
        tipo={config?.ojos}
        colorOjos={config?.colorOjos}
        colorCejas={config?.colorPelo}
      />
      <Nariz tipo={config?.nariz} />
      <Boca tipo={config?.boca} />
      <Pelo tipo={config?.pelo} colorPelo={config?.colorPelo} />
      <Barba tipo={config?.barba} colorBarba={config?.colorBarba} />
    </div>
  )
}

export default AvatarPreview