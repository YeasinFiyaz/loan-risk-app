import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const RISK_CONFIG = {
    LOW:       { label: 'Low Risk',       color: '#10b981', glow: 'rgba(16,185,129,0.3)',  angle: 25,  grade: 'A', message: 'This applicant shows strong financial health. Loan approval is recommended.'         },
    MEDIUM:    { label: 'Medium Risk',    color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  angle: 90,  grade: 'B', message: 'Moderate risk detected. Consider additional verification before approval.'          },
    HIGH:      { label: 'High Risk',      color: '#f97316', glow: 'rgba(249,115,22,0.3)',  angle: 155, grade: 'C', message: 'Significant default risk. Proceed with caution or request collateral.'              },
    VERY_HIGH: { label: 'Very High Risk', color: '#f43f5e', glow: 'rgba(244,63,94,0.3)',   angle: 220, grade: 'D', message: 'Critical default risk detected. Loan approval is not recommended at this time.'    },
};

function RiskMeter({ category, score, animated }) {
    const config  = RISK_CONFIG[category] || RISK_CONFIG.MEDIUM;
    const percent = Math.round(score * 100);

    // Needle angle: -90 (far left) to +90 (far right)
    const needleAngle = -90 + (score * 180);

    return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>

            {/* Meter SVG */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg width="320" height="180" viewBox="0 0 320 180">
                    <defs>
                        {/* Gradient arc segments */}
                        <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#10b981" />
                            <stop offset="33%"  stopColor="#f59e0b" />
                            <stop offset="66%"  stopColor="#f97316" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>

                        {/* Needle glow */}
                        <filter id="needleGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background arc track */}
                    <path
                        d="M 30 160 A 130 130 0 0 1 290 160"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="24"
                        strokeLinecap="round"
                    />

                    {/* Colored arc */}
                    <path
                        d="M 30 160 A 130 130 0 0 1 290 160"
                        fill="none"
                        stroke="url(#meterGrad)"
                        strokeWidth="24"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        style={{
                            strokeDasharray: '408',
                            strokeDashoffset: animated ? '0' : '408',
                            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
                        }}
                    />

                    {/* Tick marks */}
                    {[-90, -60, -30, 0, 30, 60, 90].map((angle, i) => {
                        const rad = (angle - 90) * Math.PI / 180;
                        const x1  = 160 + 115 * Math.cos(rad);
                        const y1  = 160 + 115 * Math.sin(rad);
                        const x2  = 160 + 128 * Math.cos(rad);
                        const y2  = 160 + 128 * Math.sin(rad);
                        return (
                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
                        );
                    })}

                    {/* Labels */}
                    {[
                        { angle: -90, label: 'LOW'  },
                        { angle: -30, label: 'MED'  },
                        { angle:  30, label: 'HIGH' },
                        { angle:  90, label: 'MAX'  },
                    ].map(({ angle, label }) => {
                        const rad = (angle - 90) * Math.PI / 180;
                        const x   = 160 + 148 * Math.cos(rad);
                        const y   = 160 + 148 * Math.sin(rad);
                        return (
                            <text key={label} x={x} y={y}
                                textAnchor="middle" dominantBaseline="middle"
                                fill="rgba(255,255,255,0.3)"
                                fontSize="9"
                                fontFamily="DM Sans, sans-serif"
                                fontWeight="600"
                                letterSpacing="0.5"
                            >{label}</text>
                        );
                    })}

                    {/* Needle */}
                    <g transform={`rotate(${animated ? needleAngle : -90}, 160, 160)`}
                        style={{ transition: 'transform 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                        <line
                            x1="160" y1="160"
                            x2="160" y2="48"
                            stroke={config.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter="url(#needleGlow)"
                        />
                        <circle cx="160" cy="160" r="8"
                            fill={config.color}
                            filter="url(#needleGlow)"
                        />
                        <circle cx="160" cy="160" r="4"
                            fill="var(--navy)"
                        />
                    </g>

                    {/* Center score display */}
                    <text x="160" y="142"
                        textAnchor="middle"
                        fill={config.color}
                        fontSize="28"
                        fontFamily="Syne, sans-serif"
                        fontWeight="800"
                    >{percent}%</text>

                    <text x="160" y="162"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.3)"
                        fontSize="9"
                        fontFamily="DM Sans, sans-serif"
                        fontWeight="500"
                        letterSpacing="1"
                    >DEFAULT PROBABILITY</text>
                </svg>
            </div>

            {/* Risk Label */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: `rgba(${config.color === '#10b981' ? '16,185,129' : config.color === '#f59e0b' ? '245,158,11' : config.color === '#f97316' ? '249,115,22' : '244,63,94'},0.1)`,
                border: `1px solid ${config.color}40`,
                borderRadius: '100px',
                padding: '10px 24px',
                marginTop: '8px',
            }}>
                <div style={{
                    width: '10px', height: '10px',
                    borderRadius: '50%',
                    background: config.color,
                    boxShadow: `0 0 10px ${config.color}`,
                }}/>
                <span style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: '700',
                    fontSize: '18px',
                    color: config.color,
                }}>{config.label}</span>
            </div>
        </div>
    );
}

export default function Result() {
    const { state }           = useLocation();
    const navigate            = useNavigate();
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimated(true), 300);
    }, []);

    if (!state) return (
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>No result data found.</p>
            <button className="btn-primary" onClick={() => navigate('/apply')}>Go Back</button>
        </div>
    );

    const config  = RISK_CONFIG[state.risk_category] || RISK_CONFIG.MEDIUM;
    const percent = Math.round(state.risk_score * 100);

    const details = [
        { label: 'Risk Score',      value: `${percent}%`              },
        { label: 'Risk Category',   value: config.label               },
        { label: 'Risk Grade',      value: config.grade               },
        { label: 'Threshold Used',  value: `${Math.round(state.threshold_used * 100)}%` },
        { label: 'Decision',        value: state.is_default ? 'Likely Default' : 'Likely Repay' },
        { label: 'Application ID',  value: `#${state.id}`             },
    ];

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

            {/* Header */}
            <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '36px',
                    fontWeight: '800',
                    letterSpacing: '-1px',
                    marginBottom: '8px',
                }}>Risk Assessment <span style={{
                    background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>Result</span></h1>
                <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#64748b',
                    fontSize: '15px',
                }}>Applicant: <strong style={{ color: '#94a3b8' }}>{state.full_name}</strong></p>
            </div>

            {/* Meter Card */}
            <div className="glass animate-fade-up" style={{
                padding: '40px 32px',
                marginBottom: '20px',
                textAlign: 'center',
                border: `1px solid ${config.color}25`,
                boxShadow: `0 0 40px ${config.glow}`,
            }}>
                <RiskMeter
                    category={state.risk_category}
                    score={state.risk_score}
                    animated={animated}
                />

                {/* Message */}
                <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '15px',
                    color: '#94a3b8',
                    maxWidth: '480px',
                    margin: '20px auto 0',
                    lineHeight: '1.7',
                }}>{config.message}</p>
            </div>

            {/* Details Grid */}
            <div className="glass animate-fade-up" style={{ padding: '28px', marginBottom: '20px' }}>
                <h2 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    color: '#94a3b8',
                }}>Assessment Details</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                }}>
                    {details.map(({ label, value }) => (
                        <div key={label} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                            padding: '16px',
                        }}>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '11px',
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '6px',
                            }}>{label}</div>
                            <div style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: label === 'Risk Category' ? config.color : '#f1f5f9',
                            }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    className="btn-primary"
                    style={{ flex: 1, padding: '16px' }}
                    onClick={() => navigate('/apply')}
                >New Application</button>
                <button
                    style={{
                        flex: 1,
                        padding: '16px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#94a3b8',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: '600',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onClick={() => navigate('/dashboard')}
                    onMouseOver={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                        e.target.style.color = '#f1f5f9';
                    }}
                    onMouseOut={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.color = '#94a3b8';
                    }}
                >View Dashboard</button>
            </div>
        </div>
    );
}