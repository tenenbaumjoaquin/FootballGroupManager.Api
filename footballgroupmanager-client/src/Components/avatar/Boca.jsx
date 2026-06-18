import Boca01 from './boca/Boca01'
import Boca02 from './boca/Boca02'
import Boca03 from './boca/Boca03'
import Boca04 from './boca/Boca04'
import Boca05 from './boca/Boca05'
import Boca06 from './boca/Boca06'

const BOCAS = {
  boca_01: Boca01,
  boca_02: Boca02,
  boca_03: Boca03,
  boca_04: Boca04,
  boca_05: Boca05,
  boca_06: Boca06,
}

function Boca({ tipo = 'boca_01' }) {
  const BocaComponent = BOCAS[tipo]
  if (!BocaComponent) return null
  return <BocaComponent />
}

export default Boca