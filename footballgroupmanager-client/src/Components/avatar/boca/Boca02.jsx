function Boca02({ color1 = '#913c32' }) {
  return (
    <svg
      id="VECTORIZADO"
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
      <g id="Boca">
        <g id="color1" fill={color1}>
          <rect x="23" y="46" width="8" height="1" />
          <rect x="24" y="47" width="6" height="1" />
        </g>

        <g id="contorno" fill="#000">
          <rect x="21" y="45" width="12" height="1" />
          <rect x="31" y="46" width="1" height="1" />
          <rect x="22" y="46" width="1" height="1" />
          <rect x="23" y="47" width="1" height="1" />
          <rect x="30" y="47" width="1" height="1" />
          <rect x="24" y="48" width="6" height="1" />
        </g>
      </g>
    </svg>
  )
}

export default Boca02