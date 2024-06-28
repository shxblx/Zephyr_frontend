import React from "react";

type Props = {
  px: number;
  py: number;
  value: string;
  color?: string;
  borderColor?: string;
  bgColor?: string;
  hoverFontColor?: string;
};

const WhiteButton = ({
  px,
  py,
  value,
  color,
  borderColor = "white",
  bgColor = "transparent",
  hoverFontColor = "black",
}: Props) => {
  const buttonStyle = {
    padding: `${py}px ${px}px`,
    borderColor: borderColor,
    color: color,
    backgroundColor: bgColor,
    borderWidth: "2px",
    "--hover-font-color": hoverFontColor,
  } as React.CSSProperties;

  return (
    <button className="white-button" style={buttonStyle}>
      <span className="button-text">{value}</span>
    </button>
  );
};

export default WhiteButton;
