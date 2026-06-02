import Pelo01 from './pelo/Pelo01'
import Pelo02 from './pelo/Pelo02'
import Pelo03 from './pelo/Pelo03'

const PELOS = {
  pelo_01: Pelo01,
  pelo_02: Pelo02,
  pelo_03: Pelo03,
}

function Pelo({ tipo = 'pelo_01', colorPelo = '#50322a' }) {
  const PeloComponent = PELOS[tipo]
  if (!PeloComponent) return null
  return <PeloComponent colorPelo={colorPelo} />
}

export default Pelo