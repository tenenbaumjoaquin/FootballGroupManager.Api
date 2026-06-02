import Boca01 from './boca/Boca01'
import Boca02 from './boca/Boca02'
import Boca03 from './boca/Boca03'

const BOCAS = {
  boca_01: Boca01,
  boca_02: Boca02,
  boca_03: Boca03,
}

function Boca({ tipo = 'boca_01' }) {
  const BocaComponent = BOCAS[tipo]
  if (!BocaComponent) return null
  return <BocaComponent />
}

export default Boca