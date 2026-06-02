import Camiseta01 from './camiseta/Camiseta01'
import Camiseta02 from './camiseta/Camiseta02'
import Camiseta03 from './camiseta/Camiseta03'

const CAMISETAS = {
  camiseta_01: Camiseta01,
  camiseta_02: Camiseta02,
  camiseta_03: Camiseta03
}

function Camiseta({ tipo = 'camiseta_01', colorPrincipal = '#0b62cd', colorSecundario = '#e7e404' }) {
  const CamisetaComponent = CAMISETAS[tipo]
  if (!CamisetaComponent) return null
  return <CamisetaComponent colorPrincipal={colorPrincipal} colorSecundario={colorSecundario} />
}

export default Camiseta