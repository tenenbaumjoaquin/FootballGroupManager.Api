const FONDOS = {
  gradiente_01: 'linear-gradient(135deg, #6B2FA0, #9B59B6)',
  gradiente_02: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
  gradiente_03: 'linear-gradient(135deg, #1a7a1a, #2ecc71)',
  gradiente_04: 'linear-gradient(135deg, #7a1a1a, #e74c3c)',
  gradiente_05: 'linear-gradient(135deg, #7a6a00, #f0c040)',
  gradiente_06: 'linear-gradient(135deg, #000, #333)',
}

function AvatarPreview({ config, size = 200 }) {
  const fondo = FONDOS[config?.fondo] || FONDOS.gradiente_01

  return (
    <div style={{
      width: size,
      height: size,
      background: fondo,
      position: 'relative',
      overflow: 'hidden',
      clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
      flexShrink: 0,
    }}>
      {/* Cuando tengas los SVGs, reemplazás cada div por tu componente SVG */}

      {/* Capa 1 — Cara + piel */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '55%',
        height: '55%',
        background: config?.colorPiel || '#F5CBA7',
        borderRadius: '40% 40% 35% 35%',
      }} />

      {/* Orejas */}
      <div style={{
        position: 'absolute',
        bottom: '38%',
        left: '18%',
        width: '8%',
        height: '14%',
        background: config?.colorPiel || '#F5CBA7',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '38%',
        right: '18%',
        width: '8%',
        height: '14%',
        background: config?.colorPiel || '#F5CBA7',
        borderRadius: '50%',
      }} />

      {/* Capa 2 — Pelo */}
      <div style={{
        position: 'absolute',
        bottom: '60%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '58%',
        height: '30%',
        background: config?.colorPelo || '#000',
        borderRadius: '50% 50% 0 0',
      }} />

      {/* Capa 3 — Ojos */}
      <div style={{
        position: 'absolute',
        bottom: '45%',
        left: '30%',
        width: '10%',
        height: '10%',
        background: config?.colorOjos || '#1E90FF',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '45%',
        right: '30%',
        width: '10%',
        height: '10%',
        background: config?.colorOjos || '#1E90FF',
        borderRadius: '50%',
      }} />

      {/* Capa 4 — Barba (solo si no es "ninguno") */}
      {config?.barba !== 'ninguno' && (
        <div style={{
          position: 'absolute',
          bottom: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%',
          height: '15%',
          background: config?.colorBarba || '#000',
          borderRadius: '0 0 50% 50%',
          opacity: 0.8,
        }} />
      )}

      {/* Capa 5 — Camiseta */}
      <div style={{
        position: 'absolute',
        bottom: '0%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        height: '22%',
        background: config?.colorCamisetaPrincipal || '#CC0000',
        borderRadius: '4px 4px 0 0',
      }} />

      {/* Franja secundaria camiseta */}
      <div style={{
        position: 'absolute',
        bottom: '0%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '15%',
        height: '22%',
        background: config?.colorCamisetaSecundario || '#FFF',
      }} />
    </div>
  )
}

export default AvatarPreview