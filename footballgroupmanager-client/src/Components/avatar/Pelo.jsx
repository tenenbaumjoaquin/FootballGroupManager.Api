import Pelo01 from './pelo/Pelo01'
import Pelo02 from './pelo/Pelo02'
import Pelo03 from './pelo/Pelo03'
import Pelo04 from './pelo/Pelo04'
import Pelo05 from './pelo/Pelo05'
import Pelo06 from './pelo/Pelo06'
import Pelo07 from './pelo/Pelo07'
import Pelo08 from './pelo/Pelo08'
import Pelo09 from './pelo/Pelo09'

const PELOS = {
  pelo_01: Pelo01,
  pelo_02: Pelo02,
  pelo_03: Pelo03,
  pelo_04: Pelo04,
  pelo_05: Pelo05,
  pelo_06: Pelo06,
  pelo_07: Pelo07,
  pelo_08: Pelo08,
  pelo_09: Pelo09,
}

function Pelo({ tipo = 'pelo_01', colorPelo = '#50322a' }) {
  const PeloComponent = PELOS[tipo]
  if (!PeloComponent) return null
  return <PeloComponent colorPelo={colorPelo} />
}

export default Pelo