// src/components/avatar/Ojos.jsx
import Ojos01 from './ojos/Ojos01'
import Ojos02 from './ojos/Ojos02'
import Ojos03 from './ojos/Ojos03'
import Ojos04 from './ojos/Ojos04'

const OJOS = {
  ojos_01: Ojos01,
  ojos_02: Ojos02,
  ojos_03: Ojos03,
  ojos_04: Ojos04,
}

function Ojos({ tipo = 'ojos_01', colorOjos = '#556a16', colorCejas = '#4c2b23' }) {
  const OjosComponent = OJOS[tipo]
  if (!OjosComponent) return null
  return <OjosComponent colorOjos={colorOjos} colorCejas={colorCejas} />
}

export default Ojos