import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RISK_COLORS = {
    LOW:       { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)'  },
    MEDIUM:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)'  },
    HIGH:      { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)'  },
    VERY_HIGH: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.25)'   },
};

function StatCard({ label, value, color, sublabel }) {
    return (
        <div className="glass" style={{
            padding: '24px',
            borderLeft: `3px solid ${color}`,
            transition: 'all 0.3s ease',
        }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${color}20`;
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
            }}>{label}</div>
            <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '36px',
                fontWeight: '800',
                color: color,
                lineHeight: 1,
                marginBottom: '4px',
            }}>{value}</div>
            {sublabel && (
                <div style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    color: '#475569',
                }}>{sublabel}</div>
            )}
        </div>
    );
}

function MiniBar({ value, max, color }) {
    return (
        <div style={{
            height: '6px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginTop: '8px',
        }}>
            <div style={{
                height: '100%',
                width: `${max > 0 ? (value / max) * 100 : 0}%`,
                background: color,
                borderRadius: '3px',
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
            }}/>
        </div>
    );
}

export default function Dashboard() {
    const navigate              = useNavigate();
    const [apps,   setApps]     = useState([]);
    const [stats,  setStats]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState('ALL');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, statsRes] = await Promise.all([
                    api.get('/loans/applications/'),
                    api.get('/loans/dashboard/stats/'),
                ]);
                setApps(appsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = filter === 'ALL'
        ? apps
        : apps.filter(a => a.risk_category === filter);

    if (loading) return (
        <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh',
            flexDirection: 'column', gap: '16px',
        }}>
            <div style={{
                width: '48px', height: '48px',
                border: '3px solid rgba(59,130,246,0.2)',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }}/>
            <p style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#475569', fontSize: '14px',
            }}>Loading dashboard...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

            {/* Header */}
            <div className="animate-fade-up" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '16px',
            }}>
                <div>
                    <h1 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '36px',
                        fontWeight: '800',
                        letterSpacing: '-1px',
                        marginBottom: '6px',
                    }}>Risk <span style={{
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Dashboard</span></h1>
                    <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#475569', fontSize: '14px',
                    }}>All submitted loan applications and their risk assessments</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/apply')}
                    style={{ padding: '12px 24px' }}
                >New Application</button>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                }} className="stagger">
                    <StatCard
                        label="Total Applications"
                        value={stats.total_applications}
                        color="#3b82f6"
                        sublabel="all time"
                    />
                    <StatCard
                        label="Low Risk"
                        value={stats.low_risk}
                        color="#10b981"
                        sublabel="safe to approve"
                    />
                    <StatCard
                        label="Medium Risk"
                        value={stats.medium_risk}
                        color="#f59e0b"
                        sublabel="needs review"
                    />
                    <StatCard
                        label="High Risk"
                        value={stats.high_risk}
                        color="#f97316"
                        sublabel="proceed with caution"
                    />
                    <StatCard
                        label="Very High Risk"
                        value={stats.very_high_risk}
                        color="#f43f5e"
                        sublabel="not recommended"
                    />
                    <StatCard
                        label="Default Rate"
                        value={`${stats.default_rate}%`}
                        color="#a78bfa"
                        sublabel="high + very high"
                    />
                </div>
            )}

            {/* Risk Distribution Bar */}
            {stats && stats.total_applications > 0 && (
                <div className="glass animate-fade-up" style={{
                    padding: '24px', marginBottom: '32px',
                }}>
                    <h2 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '15px', fontWeight: '700',
                        color: '#94a3b8', marginBottom: '16px',
                    }}>Risk Distribution</h2>
                    <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', gap: '2px' }}>
                        {[
                            { key: 'low_risk',       color: '#10b981' },
                            { key: 'medium_risk',    color: '#f59e0b' },
                            { key: 'high_risk',      color: '#f97316' },
                            { key: 'very_high_risk', color: '#f43f5e' },
                        ].map(({ key, color }) => {
                            const pct = stats.total_applications > 0
                                ? (stats[key] / stats.total_applications) * 100
                                : 0;
                            return pct > 0 ? (
                                <div key={key} style={{
                                    width: `${pct}%`,
                                    background: color,
                                    transition: 'width 1s ease',
                                    position: 'relative',
                                }}/>
                            ) : null;
                        })}
                    </div>
                    <div style={{
                        display: 'flex', gap: '20px',
                        marginTop: '12px', flexWrap: 'wrap',
                    }}>
                        {[
                            { label: 'Low',       key: 'low_risk',       color: '#10b981' },
                            { label: 'Medium',    key: 'medium_risk',    color: '#f59e0b' },
                            { label: 'High',      key: 'high_risk',      color: '#f97316' },
                            { label: 'Very High', key: 'very_high_risk', color: '#f43f5e' },
                        ].map(({ label, key, color }) => (
                            <div key={key} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                <div style={{
                                    width: '8px', height: '8px',
                                    borderRadius: '50%', background: color,
                                }}/>
                                <span style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '12px', color: '#64748b',
                                }}>{label}: {stats[key]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{
                display: 'flex', gap: '8px',
                marginBottom: '20px', flexWrap: 'wrap',
            }}>
                {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: filter === f
                            ? `1px solid ${f === 'ALL' ? '#3b82f6' : RISK_COLORS[f]?.color}50`
                            : '1px solid rgba(255,255,255,0.06)',
                        background: filter === f
                            ? f === 'ALL' ? 'rgba(59,130,246,0.15)' : RISK_COLORS[f]?.bg
                            : 'transparent',
                        color: filter === f
                            ? f === 'ALL' ? '#60a5fa' : RISK_COLORS[f]?.color
                            : '#475569',
                    }}>{f.replace('_', ' ')}</button>
                ))}
            </div>

            {/* Applications Table */}
            <div className="glass animate-fade-up" style={{ overflow: 'hidden' }}>
                {filtered.length === 0 ? (
                    <div style={{
                        padding: '60px', textAlign: 'center',
                        color: '#475569', fontFamily: 'DM Sans, sans-serif',
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                        <p>No applications found.</p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/apply')}
                            style={{ marginTop: '16px', padding: '10px 24px' }}
                        >Submit First Application</button>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['ID', 'Applicant', 'Loan Amount', 'Income', 'Purpose', 'Risk Score', 'Category', 'Date'].map(h => (
                                    <th key={h} style={{
                                        padding: '14px 16px',
                                        textAlign: 'left',
                                        fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#475569',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.8px',
                                        whiteSpace: 'nowrap',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((app, i) => {
                                const rc = RISK_COLORS[app.risk_category] || RISK_COLORS.MEDIUM;
                                return (
                                    <tr key={app.id}
                                        onClick={() => navigate(`/result/${app.id}`, { state: app })}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease',
                                            animation: `fadeUp 0.4s ease forwards ${i * 0.04}s`,
                                            opacity: 0,
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: '13px', color: '#475569' }}>#{app.id}</td>
                                        <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: '14px', color: '#f1f5f9', fontWeight: '500' }}>{app.full_name}</td>
                                        <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: '13px', color: '#94a3b8' }}>${Number(app.loan_amnt).toLocaleString()}</td>
                                        <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: '13px', color: '#94a3b8' }}>${Number(app.annual_inc).toLocaleString()}</td>
                                        <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: '13px', color: '#94a3b8', textTransform: 'capitalize' }}>{app.purpose?.replace('_', ' ')}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{
                                                fontFamily: 'Syne, sans-serif',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                color: rc.color,
                                            }}>{Math.round(app.risk_score * 100)}%</div>
                                            <MiniBar
                                                value={app.risk_score * 100}
                                                max={100}
                                                color={rc.color}
                                            />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                background: rc.bg,
                                                border: `1px solid ${rc.border}`,
                                                color: rc.color,
                                                fontFamily: 'DM Sans, sans-serif',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                whiteSpace: 'nowrap',
                                            }}>{app.risk_category?.replace('_', ' ')}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontFamily: 'DM Sans', fontSize: '12px', color: '#475569', whiteSpace: 'nowrap' }}>
                                            {new Date(app.submitted_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}