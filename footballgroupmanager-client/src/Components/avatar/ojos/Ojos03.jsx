function Ojos03({
  colorOjos = '#000000',
  colorCejas = '#50322a',
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
      <g id="Ojos">
        <g id="esclerotica" fill="#fff">
          <rect x="34" y="33" width="1" height="1" />
          <rect x="31" y="33" width="1" height="1" />
          <rect x="22" y="33" width="1" height="1" />
          <rect x="19" y="33" width="1" height="1" />
        </g>

        <g id="pupila" fill={colorOjos}>
          <rect x="32" y="33" width="2" height="1" />
          <rect x="20" y="33" width="2" height="1" />
        </g>

        <g id="colorCejas" fill='#000000'>
          <rect x="17" y="30" width="8" height="1" />
          <rect x="16" y="31" width="2" height="1" />
          <rect x="29" y="30" width="8" height="1" />
          <rect x="36" y="31" width="2" height="1" />
        </g>
      </g>
    </svg>
  );
}

export default Ojos03;