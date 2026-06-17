// src/components/avatar/Nariz.jsx
import Nariz01 from './nariz/Nariz01'
import Nariz02 from './nariz/Nariz02'
import Nariz03 from './nariz/Nariz03'
import Nariz04 from './nariz/Nariz04'
import Nariz05 from './nariz/Nariz05'
import Nariz06 from './nariz/Nariz06'

const NARICES = {
  nariz_01: Nariz01,
  nariz_02: Nariz02,
  nariz_03: Nariz03,
  nariz_04: Nariz04,
  nariz_05: Nariz05,
  nariz_06: Nariz06,
}

function Nariz({ tipo = 'nariz_01' }) {
  const NarizComponent = NARICES[tipo]
  if (!NarizComponent) return null
  return <NarizComponent />
}

export default Nariz