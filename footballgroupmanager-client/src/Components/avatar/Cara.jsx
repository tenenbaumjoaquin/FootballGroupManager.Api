import Cara01 from './cara/Cara01'
import Cara02 from './cara/Cara02'

const CARAS = {
  cara_01: Cara01,
  cara_02: Cara02,
}

function Cara({ tipo = 'cara_01', colorPiel = '#ffcda5' }) {
  const CaraComponent = CARAS[tipo]
  if (!CaraComponent) return null
  return <CaraComponent colorPiel={colorPiel} />
}

export default Cara