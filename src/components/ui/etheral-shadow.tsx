'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

interface AnimationConfig {
    scale: number;
    speed: number;
}

interface NoiseConfig {
    opacity: number;
    scale: number;
}

interface ShadowOverlayProps {
    sizing?: 'fill' | 'stretch';
    color?: string;
    animation?: AnimationConfig;
    noise?: NoiseConfig;
    style?: CSSProperties;
    className?: string;
    children?: React.ReactNode;
}

function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
): number {
    if (fromLow === fromHigh) return toLow;
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
    const id = useId();
    return `ethereal-${id.replace(/:/g, '')}`;
};

/**
 * Hero backdrop: organic “weave” via animated feTurbulence + displacement.
 * Uses a multi-stop gradient as SourceGraphic so displacement is visible (flat fills show almost no motion).
 */
export function EtherealShadow({
    sizing = 'fill',
    color = 'rgba(220, 38, 60, 0.55)',
    animation,
    noise,
    style,
    className,
    children
}: ShadowOverlayProps) {
    const id = useInstanceId();
    const animationEnabled = Boolean(animation && animation.scale > 0);
    const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
    const hueRotateMotionValue = useMotionValue(0);
    const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

    const displacementScale = animation ? mapRange(animation.scale, 1, 100, 28, 90) : 0;
    const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

    useEffect(() => {
        if (!feColorMatrixRef.current || !animationEnabled) return;
        if (hueRotateAnimation.current) hueRotateAnimation.current.stop();
        hueRotateMotionValue.set(0);
        hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
            duration: Math.max(2.5, animationDuration / 20),
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            onUpdate: (value: number) => {
                feColorMatrixRef.current?.setAttribute('values', String(value));
            }
        });
        return () => {
            hueRotateAnimation.current?.stop();
        };
    }, [animationEnabled, animationDuration, hueRotateMotionValue]);

    return (
        <div
            className={className}
            style={{
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
                height: '100%',
                ...style
            }}
        >
            <div
                className="absolute eth-hero-weave-css"
                style={{
                    inset: -displacementScale,
                    filter: animationEnabled ? `url(#${id}) blur(0.5px)` : 'none'
                }}
            >
                {animationEnabled && (
                    <svg className="absolute w-0 h-0" aria-hidden>
                        <defs>
                            <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.008 0.012"
                                    numOctaves="3"
                                    seed="2"
                                    result="noise"
                                >
                                    <animate
                                        attributeName="baseFrequency"
                                        dur="22s"
                                        values="0.006 0.01;0.012 0.006;0.008 0.014;0.006 0.01"
                                        repeatCount="indefinite"
                                    />
                                </feTurbulence>
                                <feColorMatrix
                                    ref={feColorMatrixRef}
                                    in="noise"
                                    type="hueRotate"
                                    values="0"
                                    result="warp"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="warp"
                                    scale={displacementScale}
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                    result="displaced"
                                />
                                <feGaussianBlur in="displaced" stdDeviation="0.8" result="soft" />
                            </filter>
                        </defs>
                    </svg>
                )}
                <div
                    className="w-full h-full"
                    style={{
                        ...(sizing === 'stretch' ? { backgroundSize: '100% 100%' } : {}),
                        background: `
              radial-gradient(ellipse 85% 65% at 50% 110%, ${color} 0%, transparent 55%),
              radial-gradient(ellipse 70% 50% at 10% 20%, rgba(220, 38, 60, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 55% 45% at 90% 15%, rgba(127, 29, 29, 0.4) 0%, transparent 45%),
              linear-gradient(165deg, rgba(12, 6, 8, 0.95) 0%, rgba(18, 8, 12, 0.88) 40%, rgba(8, 4, 6, 0.98) 100%)
            `,
                        maskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)'
                    }}
                />
            </div>

            {children != null && (
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none [&>*]:pointer-events-auto"
                >
                    {children}
                </div>
            )}

            {noise && noise.opacity > 0 && (
                <div
                    className="absolute inset-0 z-[5] pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
                        backgroundSize: noise.scale * 200,
                        backgroundRepeat: 'repeat',
                        opacity: noise.opacity * 0.35
                    }}
                />
            )}
        </div>
    );
}

export default EtherealShadow;
