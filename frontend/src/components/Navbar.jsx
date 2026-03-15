import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive    = (path) => location.pathname === path;
    const isLoggedIn  = !!localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'rgba(10,15,30,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: '800',
                        fontSize: '14px',
                        color: 'white',
                    }}>LR</div>
                    <span style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: '700',
                        fontSize: '18px',
                        color: '#f1f5f9',
                        letterSpacing: '-0.3px',
                    }}>LoanRisk<span style={{ color: '#3b82f6' }}>AI</span></span>
                </Link>

                {/* Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[
                        { path: '/',      label: 'Home'      },
                        { path: '/apply', label: 'Apply Now' },
                    ].map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            style={{
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontFamily: 'DM Sans, sans-serif',
                                fontWeight: '500',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                background: isActive(path)
                                    ? 'rgba(59,130,246,0.15)'
                                    : 'transparent',
                                color: isActive(path) ? '#60a5fa' : '#94a3b8',
                                border: isActive(path)
                                    ? '1px solid rgba(59,130,246,0.3)'
                                    : '1px solid transparent',
                            }}
                        >{label}</Link>
                    ))}

                    {/* Dashboard — only show if logged in */}
                    {isLoggedIn && (
                        <Link to="/dashboard" style={{
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            background: isActive('/dashboard')
                                ? 'rgba(59,130,246,0.15)'
                                : 'transparent',
                            color: isActive('/dashboard') ? '#60a5fa' : '#94a3b8',
                            border: isActive('/dashboard')
                                ? '1px solid rgba(59,130,246,0.3)'
                                : '1px solid transparent',
                        }}>Dashboard</Link>
                    )}

                    {/* Login / Logout button */}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            style={{
                                marginLeft: '8px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontFamily: 'DM Sans, sans-serif',
                                fontWeight: '500',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: 'rgba(244,63,94,0.1)',
                                color: '#fb7185',
                                border: '1px solid rgba(244,63,94,0.2)',
                            }}
                            onMouseOver={e => {
                                e.target.style.background = 'rgba(244,63,94,0.2)';
                            }}
                            onMouseOut={e => {
                                e.target.style.background = 'rgba(244,63,94,0.1)';
                            }}
                        >Logout</button>
                    ) : (
                        <Link to="/login" style={{
                            textDecoration: 'none',
                            marginLeft: '8px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            background: 'rgba(59,130,246,0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59,130,246,0.3)',
                        }}>Admin Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}