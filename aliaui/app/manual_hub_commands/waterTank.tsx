
export default function WaterTank({ waterValue, min, max, isMixing }: { waterValue: number, min: number, max: number, isMixing: boolean }) {
  const percentage = waterValue * 100 / (max - min)
  const styles = {
    axis: {
      justifyContent: 'space-between',
      height: '400px',
      marginRight: '10px',
    },
    axisLabel: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
    },
    axisLine: {
      width: '2px',
      background: '#000',
      flexGrow: 1,
      margin: '0 auto',
    },
    container: {
      width: '200px',
      height: '400px',
      border: '2px solid #0077ff',
      borderRadius: '10px',
      overflow: 'hidden',
      background: '#e0f7ff',
    },
    water: {
      bottom: '0',
      width: '100%',
      background: '#0077ff',
      height: `${percentage}%`,
      transition: 'height 0.5s ease',
      animation: isMixing
        ? 'mixing 1s infinite linear'
        : 'none', // Add mixing effect conditionally
    },
    label: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',
    },
  };

  return (
    <div className="flex flex-end justify-center gap-20px">
      <div className="flex flex-col" style={styles.axis}>
        <div className="text-center" style={styles.axisLabel}>{max}</div>
        <div style={styles.axisLine}></div>
        <div className="text-center" style={styles.axisLabel}>{min}</div>
      </div>
      <div className="relative" style={styles.container}>
        <div className="absolute" style={styles.water}></div>
        <div className="absolute" style={styles.label}>{(Math.ceil(waterValue * 100) / 100).toFixed(2)}</div>
      </div>
      <style jsx>{`
            @keyframes mixing {
              0% {
                transform: translateY(0) scaleX(1);
              }
              25% {
                transform: translateY(-5px) scaleX(1.05);
              }
              50% {
                transform: translateY(0) scaleX(1);
              }
              75% {
                transform: translateY(5px) scaleX(0.95);
              }
              100% {
                transform: translateY(0) scaleX(1);
              }
            }
          `}</style>
    </div>
  );
};