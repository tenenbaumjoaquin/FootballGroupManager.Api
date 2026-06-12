function Ojos05({
  colorCejas = '#4A2C0A',
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
      <g id="ColorCejas" fill={colorCejas}>
        <rect x="28" y="31" width="2" height="1" />
        <rect x="29" y="30" width="2" height="1" />
        <rect x="30" y="29" width="7" height="1" />
        <rect x="24" y="31" width="2" height="1" />
        <rect x="23" y="30" width="2" height="1" />
        <rect x="17" y="29" width="7" height="1" />
      </g>

      <g id="contorno">
        <rect x="18" y="33" width="6" height="1" />
        <rect x="30" y="33" width="6" height="1" />
      </g>
    </svg>
  )
}

export default Ojos05