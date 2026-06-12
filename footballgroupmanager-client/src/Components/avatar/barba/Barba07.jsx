function Barba07({
  colorBarba = '#4c2b23',
}) {
  return (
    <svg
      id="Barba"
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
      <g id="ColorPelo" fill={colorBarba}>
        <rect x="21" y="45" width="12" height="1" />
        <rect x="20" y="46" width="2" height="5" />
        <rect x="32" y="46" width="2" height="5" />
        <rect x="22" y="44" width="3" height="1" />
        <rect x="29" y="44" width="3" height="1" />
        <rect x="22" y="46" width="1" height="1" />
        <rect x="31" y="46" width="1" height="1" />
      </g>
    </svg>
  );
}

export default Barba07;