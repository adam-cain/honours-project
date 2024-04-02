import React from 'react';

type SVGIconProps = {
  color?: string;
} & React.SVGProps<SVGSVGElement>; // Extend the SVG props to accept all valid SVG attributes

const LeftNavIcon: React.FC<SVGIconProps> = ({ color = '#FFF', ...props }) => (
  <svg
    fill="none"
    height="32"
    stroke={color}
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
    {...props} 
  >
    <path
      d="M 20.104476,2.1455587 11.895537,16 20.104476,29.854442"
      strokeWidth="3.29112"
      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
    />
  </svg>
);

const RightNavIcon: React.FC<SVGIconProps> = ({ color = '#FFF', ...props }) => (
  <svg
    fill="none"
    height="32"
    stroke={color}
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
    {...props} 
  >
    <path
      d="M 12.192116,2.4421169 19.807911,16 12.192116,29.557882"
      strokeWidth="3.88423" // Adjusted stroke-width to match SVG
      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
    />
  </svg>
);

export { LeftNavIcon, RightNavIcon};
