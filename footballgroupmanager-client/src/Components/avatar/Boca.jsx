import Boca01 from './boca/Boca01'

const BOCAS = {
  boca_01: Boca01,
}

function Boca({ tipo = 'boca_01' }) {
  const BocaComponent = BOCAS[tipo]
  if (!BocaComponent) return null
  return <BocaComponent />
}

export default Boca