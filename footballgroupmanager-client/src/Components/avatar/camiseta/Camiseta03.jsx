function Camiseta03({
  colorPrincipal = '#ffffff',
  colorSecundario = '#5cca5c',
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
      <g id="Camiseta">
        <g id="color2" fill={colorSecundario}>
          <rect x="33" y="51" width="10" height="29" />
          <rect x="11" y="51" width="10" height="29" />
        </g>

        <g id="color1" fill={colorPrincipal}>
          <rect x="21" y="51" width="12" height="29" />
          <rect x="43" y="55" width="11" height="25" />
          <rect x="43" y="51" width="2" height="4" />
          <rect x="45" y="52" width="2" height="3" />
          <rect x="47" y="53" width="2" height="2" />
          <rect x="49" y="54" width="2" height="1" />
          <rect y="55" width="11" height="25" />
          <rect x="9" y="51" width="2" height="4" />
          <rect x="7" y="52" width="2" height="3" />
          <rect x="5" y="53" width="2" height="2" />
          <rect x="3" y="54" width="2" height="1" />
        </g>

        <g id="contorno" fill="#000">
          <rect y="54" width="3" height="1" />
          <rect x="3" y="53" width="2" height="1" />
          <rect x="5" y="52" width="2" height="1" />
          <rect x="7" y="51" width="2" height="1" />
          <rect x="9" y="50" width="36" height="1" />
          <rect x="45" y="51" width="2" height="1" />
          <rect x="47" y="52" width="2" height="1" />
          <rect x="49" y="53" width="2" height="1" />
          <rect x="51" y="54" width="3" height="1" />
        </g>
      </g>
    </svg>
  );
}

export default Camiseta03;