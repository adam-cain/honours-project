import styles from "./loading-dots.module.css";

interface LoadingDotsProps {
  color?: string;
  dotBorderColor?: string;
}

const LoadingDots = ({ color = "#000", dotBorderColor = "#BBB" }: LoadingDotsProps) => {

  const dotStyle: React.CSSProperties = {
    backgroundColor: color,
    // Conditionally add border properties if dotBorderColor is provided
    ...(dotBorderColor && {
      border: `1px solid ${dotBorderColor}`,
      borderRadius: '50%', // Make sure the dots are round if they have a border
    }),
  };

  return (
    <span className={styles.loading}>
      <span style={dotStyle} />
      <span style={dotStyle} />
      <span style={dotStyle} />
    </span>
  );
};

export default LoadingDots;
