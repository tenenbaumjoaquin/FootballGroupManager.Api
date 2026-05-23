import Camiseta01 from './camiseta/Camiseta01'

const CAMISETAS = {
  camiseta_01: Camiseta01,
}

function Camiseta({ tipo = 'camiseta_01', colorPrincipal = '#0b62cd', colorSecundario = '#e7e404' }) {
  const CamisetaComponent = CAMISETAS[tipo]
  if (!CamisetaComponent) return null
  return <CamisetaComponent colorPrincipal={colorPrincipal} colorSecundario={colorSecundario} />
}

export default Camiseta