import Accesorio01 from './accesorio/Accesorio01'


const ACCESORIOS = {
  accesorio_01: Accesorio01,
}

function Accesorio({ tipo = 'accesorio_01' }) {
  const AccesorioComponent = ACCESORIOS[tipo]
  if (!AccesorioComponent) return null
  return <AccesorioComponent />
}

export default Accesorio