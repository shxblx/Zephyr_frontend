import React from 'react';

type Props = {
  px: number;
  py: number;
  value: string;
  color?: string;
  borderColor?: string;
  bgColor?: string;
  hoverFontColor?: string;
};

const OrangeButton = ({
  px,
  py,
  value,
  color = "#fff", 
  borderColor = "#ff5f09",
  bgColor = "transparent",
}: Props) => {
  const buttonStyle = {
    padding: `${py}px ${px}px`,
    color: color,
    borderColor: borderColor,
    backgroundColor: bgColor,
    borderWidth: "2px",
  } as React.CSSProperties;

  return (
    <button className="orange-button" style={buttonStyle}>
      <span className="button-text">{value}</span>
    </button>
  );
};

export default OrangeButton;
