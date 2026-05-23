import Pelo01 from './pelo/Pelo01'

const PELOS = {
  pelo_01: Pelo01,
}

function Pelo({ tipo = 'pelo_01', colorPelo = '#50322a' }) {
  const PeloComponent = PELOS[tipo]
  if (!PeloComponent) return null
  return <PeloComponent colorPelo={colorPelo} />
}

export default Pelo