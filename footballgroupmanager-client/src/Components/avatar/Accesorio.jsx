import Accesorio01 from './accesorio/Accesorio01'
import Accesorio02 from './accesorio/Accesorio02'
import Accesorio03 from './accesorio/Accesorio03'


const ACCESORIOS = {
  accesorio_01: Accesorio01,
  accesorio_02: Accesorio02,
  accesorio_03: Accesorio03
}

function Accesorio({ tipo = 'accesorio_01' }) {
  const AccesorioComponent = ACCESORIOS[tipo]
  if (!AccesorioComponent) return null
  return <AccesorioComponent />
}

export default Accesorio