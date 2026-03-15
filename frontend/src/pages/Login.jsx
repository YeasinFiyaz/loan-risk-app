import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const navigate = useNavigate();
    const [form,    setForm]    = useState({ username: '', password: '' });
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login/', form);
            localStorage.setItem('access_token',  res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                {/* Header */}
                <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: '800',
                        fontSize: '20px',
                        color: 'white',
                    }}>LR</div>
                    <h1 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '28px',
                        fontWeight: '800',
                        letterSpacing: '-0.5px',
                        marginBottom: '8px',
                    }}>Admin <span style={{
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Login</span></h1>
                    <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#475569',
                        fontSize: '14px',
                    }}>Sign in to access the dashboard</p>
                </div>

                {/* Form */}
                <div className="glass animate-fade-up" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>

                        {/* Username */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#64748b',
                                display: 'block',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>Username</label>
                            <input
                                name="username"
                                placeholder="Enter your username"
                                required
                                value={form.username}
                                onChange={handleChange}
                                className="input-field"
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#64748b',
                                display: 'block',
                                marginBottom: '6px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="input-field"
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: 'rgba(244,63,94,0.1)',
                                border: '1px solid rgba(244,63,94,0.3)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                marginBottom: '20px',
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '13px',
                                color: '#fb7185',
                            }}>{error}</div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px' }}
                        >
                            {loading ? (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2.5"
                                        style={{ animation: 'spin 1s linear infinite' }}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: '#334155',
                }}>Use your Django superuser credentials</p>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}