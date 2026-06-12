function Barba06({
  colorBarba = '#4c2b23',
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="80"
      viewBox="0 0 54 80"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <g id="colorBarba" fill={colorBarba}>
        <rect x="23" y="45" width="8" height="1" />
        <rect x="22" y="46" width="2" height="1" />
        <rect x="30" y="46" width="2" height="1" />
        <rect x="32" y="45" width="1" height="2" />
        <rect x="21" y="45" width="1" height="2" />
        <rect x="20" y="44" width="1" height="2" />
        <rect x="33" y="44" width="1" height="2" />
        <rect x="24" y="44" width="2" height="1" />
        <rect x="28" y="44" width="2" height="1" />
      </g>
    </svg>
  )
}

export default Barba06