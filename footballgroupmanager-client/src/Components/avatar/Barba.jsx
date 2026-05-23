// src/components/avatar/Barba.jsx
import Barba01 from './barba/Barba01'

const BARBAS = {
  ninguno: null,
  barba_01: Barba01,
}

function Barba({ tipo = 'ninguno', colorBarba = '#4c2b23' }) {
  const BarbaComponent = BARBAS[tipo]
  if (!BarbaComponent) return null
  return <BarbaComponent colorBarba={colorBarba} />
}

export default Barba