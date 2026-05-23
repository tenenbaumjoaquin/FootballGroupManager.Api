function Ojos01({ colorOjos = '#556a16', colorCejas = '#4c2b23' }) {
  return (
    <svg id="Ojos" xmlns="http://www.w3.org/2000/svg" width="54" height="80" viewBox="0 0 54 80"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <g id="ColorCejas" fill={colorCejas}>
        <rect x="17" y="30" width="8" height="2"/>
        <rect x="29" y="30" width="8" height="2"/>
      </g>
      <g id="pupila" fill={colorOjos}>
        <rect x="32" y="32" width="2" height="2"/>
        <rect x="20" y="32" width="2" height="2"/>
      </g>
      <g id="esclerotica" fill="#fff">
        <rect x="31" y="32" width="1" height="2"/>
        <rect x="34" y="32" width="1" height="2"/>
        <rect x="19" y="32" width="1" height="2"/>
        <rect x="22" y="32" width="1" height="2"/>
      </g>
    </svg>
  )
}

export default Ojos01