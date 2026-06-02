// src/components/avatar/Nariz.jsx
import Nariz01 from './nariz/Nariz01'
import Nariz02 from './nariz/Nariz02'
import Nariz03 from './nariz/Nariz03'

const NARICES = {
  nariz_01: Nariz01,
  nariz_02: Nariz02,
  nariz_03: Nariz03,
}

function Nariz({ tipo = 'nariz_01' }) {
  const NarizComponent = NARICES[tipo]
  if (!NarizComponent) return null
  return <NarizComponent />
}

export default Nariz