// src/components/avatar/Nariz.jsx
import Nariz01 from './nariz/Nariz01'

const NARICES = {
  nariz_01: Nariz01,
}

function Nariz({ tipo = 'nariz_01' }) {
  const NarizComponent = NARICES[tipo]
  if (!NarizComponent) return null
  return <NarizComponent />
}

export default Nariz