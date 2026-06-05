function Ojos04({ colorCejas = '#4e2d1a', colorOjos = '#000000' }) {
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
      <g id="Ojos">
        <g id="ColorCejas" fill={colorCejas}>
          <rect x="30" y="30" width="2" height="1" />
          <rect x="32" y="29" width="5" height="1" />
          <rect x="22" y="30" width="2" height="1" />
          <rect x="17" y="29" width="5" height="1" />
        </g>

        <g id="pupila" fill={colorOjos}>
          <rect x="20" y="33" width="2" height="1" />
          <rect x="32" y="33" width="2" height="1" />
        </g>

        <g id="esclerotica" fill="#fff">
          <rect x="31" y="33" width="1" height="1" />
          <rect x="34" y="33" width="2" height="1" />
          <rect x="22" y="33" width="1" height="1" />
          <rect x="18" y="33" width="2" height="1" />
        </g>

        <g id="contorno" fill="#000">
          <rect x="18" y="32" width="5" height="1" />
          <rect x="23" y="33" width="1" height="1" />
          <rect x="17" y="33" width="1" height="1" />
          <rect x="31" y="32" width="5" height="1" />
          <rect x="36" y="33" width="1" height="1" />
          <rect x="30" y="33" width="1" height="1" />
        </g>
      </g>
    </svg>
  );
}

export default Ojos04;