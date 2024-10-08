import { color } from 'd3-color';
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

    );
}