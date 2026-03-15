import { Link } from 'react-router-dom';

const stats = [
    { value: '1.3M+', label: 'Loans Analyzed'    },
    { value: '87%',   label: 'Recall Accuracy'   },
    { value: '0.71',  label: 'ROC-AUC Score'     },
    { value: '24',    label: 'Risk Features Used' },
];

const features = [
    {
        icon: '⚡',
        title: 'Instant Prediction',
        desc: 'Get real-time loan risk assessment powered by XGBoost trained on 1.3 million real loan records.',
    },
    {
        icon: '🎯',
        title: 'High Recall Rate',
        desc: 'Our model catches 87% of actual defaulters, keeping your portfolio protected.',
    },
    {
        icon: '📊',
        title: 'Risk Dashboard',
        desc: 'Track all submitted applications with full risk breakdowns and category filters.',
    },
    {
        icon: '🔒',
        title: 'Secure & Private',
        desc: 'All data is processed locally. No third-party sharing, no external APIs.',
    },
];

export default function Home() {
    return (
        <div style={{ minHeight: '100vh' }}>

            {/* Hero Section */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '100px 24px 80px',
                textAlign: 'center',
                position: 'relative',
            }}>
                {/* Badge */}
                <div className="animate-fade-up" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    marginBottom: '32px',
                }}>
                    <span style={{
                        width: '6px', height: '6px',
                        background: '#10b981',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'pulse-ring 2s infinite',
                    }}/>
                    <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '13px',
                        color: '#60a5fa',
                        fontWeight: '500',
                    }}>AI-Powered Loan Risk Assessment</span>
                </div>

                {/* Headline */}
                <h1 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(40px, 7vw, 80px)',
                    fontWeight: '800',
                    lineHeight: '1.05',
                    letterSpacing: '-2px',
                    marginBottom: '24px',
                    opacity: 0,
                    animation: 'fadeUp 0.7s ease forwards 0.1s',
                }}>
                    Predict Loan Risk
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Before It Happens</span>
                </h1>

                {/* Subheading */}
                <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '18px',
                    color: '#94a3b8',
                    maxWidth: '560px',
                    margin: '0 auto 48px',
                    lineHeight: '1.7',
                    opacity: 0,
                    animation: 'fadeUp 0.7s ease forwards 0.2s',
                }}>
                    Enter applicant details and get an instant risk score powered
                    by machine learning trained on over 1.3 million real loan records.
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    opacity: 0,
                    animation: 'fadeUp 0.7s ease forwards 0.3s',
                }}>
                    <Link to="/apply" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 36px' }}>
                            Analyze a Loan
                        </button>
                    </Link>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <button style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: '#94a3b8',
                            borderRadius: '12px',
                            padding: '16px 36px',
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                            onMouseOver={e => {
                                e.target.style.borderColor = 'rgba(255,255,255,0.25)';
                                e.target.style.color = '#f1f5f9';
                            }}
                            onMouseOut={e => {
                                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                                e.target.style.color = '#94a3b8';
                            }}
                        >
                            View Dashboard
                        </button>
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px 80px',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                }} className="stagger">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="glass glow-blue" style={{
                            padding: '32px 24px',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '40px',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #60a5fa, #34d399)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '8px',
                            }}>{value}</div>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '14px',
                                color: '#64748b',
                                fontWeight: '500',
                            }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px 100px',
            }}>
                <h2 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '36px',
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: '48px',
                    letterSpacing: '-1px',
                }}>Why LoanRisk<span style={{ color: '#3b82f6' }}>AI</span>?</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                }} className="stagger">
                    {features.map(({ icon, title, desc }) => (
                        <div key={title} className="glass" style={{
                            padding: '32px',
                            transition: 'all 0.3s ease',
                            cursor: 'default',
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.1)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
                            <h3 style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '10px',
                                color: '#f1f5f9',
                            }}>{title}</h3>
                            <p style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '14px',
                                color: '#64748b',
                                lineHeight: '1.7',
                            }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}