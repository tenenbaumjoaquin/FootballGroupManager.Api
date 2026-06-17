import Cara01 from './cara/Cara01'
import Cara02 from './cara/Cara02'
import Cara03 from './cara/Cara03'
import Cara04 from './cara/Cara04'
import Cara05 from './cara/Cara05'
import Cara06 from './cara/Cara06'

const CARAS = {
  cara_01: Cara01,
  cara_02: Cara02,
  cara_03: Cara03,
  cara_04: Cara04,
  cara_05: Cara05,
  cara_06: Cara06,
}

function Cara({ tipo = 'cara_01', colorPiel = '#ffcda5' }) {
  const CaraComponent = CARAS[tipo]
  if (!CaraComponent) return null
  return <CaraComponent colorPiel={colorPiel} />
}

export default Cara