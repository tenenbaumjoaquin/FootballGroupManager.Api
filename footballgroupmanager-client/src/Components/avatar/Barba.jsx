// src/components/avatar/Barba.jsx
import Barba01 from './barba/Barba01'
import Barba02 from './barba/Barba02'
import Barba03 from './barba/Barba03'
import Barba04 from './barba/Barba04'
import Barba05 from './barba/Barba05'
import Barba06 from './barba/Barba06'
import Barba07 from './barba/Barba07'

const BARBAS = {
  ninguno: null,
  barba_01: Barba01,
  barba_02: Barba02,
  barba_03: Barba03,
  barba_04: Barba04,
  barba_05: Barba05,
  barba_06: Barba06,
  barba_07: Barba07,
}

function Barba({ tipo = 'ninguno', colorBarba = '#4c2b23' }) {
  const BarbaComponent = BARBAS[tipo]
  if (!BarbaComponent) return null
  return <BarbaComponent colorBarba={colorBarba} />
}

export default Barba