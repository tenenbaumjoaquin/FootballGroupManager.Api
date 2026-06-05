// src/components/avatar/Barba.jsx
import Barba01 from './barba/Barba01'
import Barba02 from './barba/Barba02'
import Barba03 from './barba/Barba03'

const BARBAS = {
  ninguno: null,
  barba_01: Barba01,
  barba_02: Barba02,
  barba_03: Barba03,
}

function Barba({ tipo = 'ninguno', colorBarba = '#4c2b23' }) {
  const BarbaComponent = BARBAS[tipo]
  if (!BarbaComponent) return null
  return <BarbaComponent colorBarba={colorBarba} />
}

export default Barba