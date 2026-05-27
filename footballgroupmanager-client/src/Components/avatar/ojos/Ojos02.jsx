function Ojos02({
  colorOjos = '#000',
  colorCejas = '#000'
}) {
  return (
    <svg
      id="VECTORIZADO"
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="80"
      viewBox="0 0 54 80"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <g id="Ojos">
        <g id="parpados" fill="#000">
          <rect x="18" y="32" width="1" height="1" />
          <rect x="19" y="31" width="4" height="1" />
          <rect x="23" y="32" width="1" height="1" />
          <rect x="30" y="32" width="1" height="1" />
          <rect x="31" y="31" width="4" height="1" />
          <rect x="35" y="32" width="1" height="1" />
        </g>

        <g id="esclerotica" fill="#fff">
          <rect x="34" y="32" width="1" height="2" />
          <rect x="31" y="32" width="1" height="2" />
          <rect x="22" y="32" width="1" height="2" />
          <rect x="19" y="32" width="1" height="2" />
        </g>

        <g id="pupila" fill={colorOjos}>
          <rect x="32" y="32" width="2" height="2" />
          <rect x="20" y="32" width="2" height="2" />
        </g>

        <g id="colorCejas" fill={colorCejas}>
          <rect x="24" y="28" width="2" height="2" />
          <rect x="17" y="28" width="7" height="1" />
          <rect x="18" y="27" width="7" height="1" />
          <rect x="16" y="29" width="1" height="1" />
          <rect x="28" y="28" width="2" height="2" />
          <rect x="29" y="27" width="7" height="1" />
          <rect x="30" y="28" width="7" height="1" />
          <rect x="37" y="29" width="1" height="1" />
        </g>
      </g>
    </svg>
  )
}

export default Ojos02