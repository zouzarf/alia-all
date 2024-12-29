import { color } from 'd3-color';
import { mix } from 'framer-motion';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';
import LiquidFillGauge from 'react-liquid-gauge';

export default function WaterTank({ waterValue, mixing }: { waterValue: number, mixing: boolean }) {

    const WATER_MAX_LEVEL = 10
    const state = waterValue
    const waveFrequency = mixing === true ? 8 : 2
    const waveAmplitude = mixing === true ? 4 : 1
    const startColor = '#6495ed'; // cornflowerblue
    const endColor = '#dc143c'; // crimson
    const radius = 150;
    //const interpolate = interpolateRgb(startColor, endColor);
    const fillColor = startColor
    const gradientStops = [
        {
            key: '0%',
            stopColor: color(fillColor)!.darker(0.5).toString(),
            stopOpacity: 1,
            offset: '0%'
        },
        {
            key: '50%',
            stopColor: fillColor,
            stopOpacity: 0.75,
            offset: '50%'
        },
        {
            key: '100%',
            stopColor: color(fillColor)!.brighter(0.5).toString(),
            stopOpacity: 0.5,
            offset: '100%'
        }
    ];
    return (
        <>
            <WaterTank2 waterValue={9.25893} min={0} max={10} isMixing={mixing} />
            <LiquidFillGauge
                style={{ margin: '0 auto' }}
                width={radius * 2}
                height={radius * 2}
                value={state / WATER_MAX_LEVEL * 100}
                percent="L"
                textSize={1}
                textOffsetX={0}
                textOffsetY={0}
                textRenderer={(props: { height: number; width: number; textSize: number; percent: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => {
                    const value = state.toFixed(2);
                    const radius = Math.min(props.height / 2, props.width / 2);
                    const textPixels = (props.textSize * radius / 2);
                    const valueStyle = {
                        fontSize: textPixels
                    };
                    const percentStyle = {
                        fontSize: textPixels * 0.6
                    };

                    return (
                        <tspan>
                            <tspan className="value" style={valueStyle}>{value}</tspan>
                            <tspan style={percentStyle}>{props.percent}</tspan>
                        </tspan>
                    );
                }}
                riseAnimation
                waveAnimation
                waveFrequency={waveFrequency}
                waveAmplitude={waveAmplitude}
                gradient
                gradientStops={gradientStops}
                circleStyle={{
                    fill: fillColor
                }}
                waveStyle={{
                    fill: fillColor
                }}
                textStyle={{
                    fill: color('#444')!.toString(),
                    fontFamily: 'Arial'
                }}
                waveTextStyle={{
                    fill: color('#fff')!.toString(),
                    fontFamily: 'Arial'
                }}
            />
        </>

    );
}

export function WaterTank2({ waterValue, min, max, isMixing }: { waterValue: number, min: number, max: number, isMixing: boolean }) {
    const percentage = waterValue * 100 / (max - min)
    const styles = {
        wrapper: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '20px',
        },
        axis: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '400px',
            marginRight: '10px',
        },
        axisLabel: {
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#333',
        },
        axisLine: {
            width: '2px',
            background: '#000',
            flexGrow: 1,
            margin: '0 auto',
        },
        container: {
            position: 'relative',
            width: '200px',
            height: '400px',
            border: '2px solid #0077ff',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#e0f7ff',
        },
        water: {
            position: 'absolute',
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
            position: 'absolute',
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
        <div style={styles.wrapper}>
            <div style={styles.axis}>
                <div style={styles.axisLabel}>{max}</div>
                <div style={styles.axisLine}></div>
                <div style={styles.axisLabel}>{min}</div>
            </div>
            <div style={styles.container}>
                <div style={styles.water}></div>
                <div style={styles.label}>{waterValue.toFixed(2)}</div>
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