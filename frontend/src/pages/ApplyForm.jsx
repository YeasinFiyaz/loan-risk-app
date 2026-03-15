import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SECTIONS = [
    {
        title: 'Loan Details',
        icon: '💳',
        fields: [
            { name: 'loan_amnt',   label: 'Loan Amount ($)',         type: 'number', placeholder: 'e.g. 15000'  },
            { name: 'installment', label: 'Monthly Installment ($)', type: 'number', placeholder: 'e.g. 450'    },
            { name: 'grade',       label: 'Loan Grade',              type: 'select',
              options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
            { name: 'purpose',     label: 'Loan Purpose',            type: 'select',
              options: [
                'debt_consolidation', 'credit_card', 'home_improvement',
                'other', 'major_purchase', 'medical', 'small_business',
                'car', 'vacation', 'moving', 'house', 'wedding',
                'educational', 'renewable_energy',
              ]},
        ],
    },
    {
        title: 'Financial Profile',
        icon: '📈',
        fields: [
            { name: 'annual_inc',  label: 'Annual Income ($)',       type: 'number', placeholder: 'e.g. 75000' },
            { name: 'dti',         label: 'Debt-to-Income Ratio (%)', type: 'number', placeholder: 'e.g. 18.5' },
            { name: 'revol_bal',   label: 'Revolving Balance ($)',   type: 'number', placeholder: 'e.g. 8000'  },
            { name: 'revol_util',  label: 'Revolving Utilization (%)', type: 'number', placeholder: 'e.g. 45' },
        ],
    },
    {
        title: 'Employment & Housing',
        icon: '🏠',
        fields: [
            { name: 'emp_length',     label: 'Employment Length (years)', type: 'number', placeholder: 'e.g. 5' },
            { name: 'home_ownership', label: 'Home Ownership',            type: 'select',
              options: ['RENT', 'OWN', 'MORTGAGE', 'OTHER'] },
        ],
    },
    {
        title: 'Credit History',
        icon: '📋',
        fields: [
            { name: 'open_acc',             label: 'Open Accounts',          type: 'number', placeholder: 'e.g. 8'   },
            { name: 'total_acc',            label: 'Total Accounts',         type: 'number', placeholder: 'e.g. 20'  },
            { name: 'mort_acc',             label: 'Mortgage Accounts',      type: 'number', placeholder: 'e.g. 1'   },
            { name: 'delinq_2yrs',          label: 'Delinquencies (2 years)', type: 'number', placeholder: 'e.g. 0' },
            { name: 'pub_rec',              label: 'Public Records',         type: 'number', placeholder: 'e.g. 0'   },
            { name: 'pub_rec_bankruptcies', label: 'Bankruptcies',           type: 'number', placeholder: 'e.g. 0'   },
        ],
    },
];

export default function ApplyForm() {
    const navigate  = useNavigate();
    const [loading, setLoading]   = useState(false);
    const [error,   setError]     = useState('');
    const [form,    setForm]      = useState({
        full_name:            '',
        loan_amnt:            '',
        installment:          '',
        grade:                'A',
        purpose:              'debt_consolidation',
        annual_inc:           '',
        dti:                  '',
        revol_bal:            '',
        revol_util:           '',
        emp_length:           '',
        home_ownership:       'RENT',
        open_acc:             '',
        total_acc:            '',
        mort_acc:             0,
        delinq_2yrs:          0,
        pub_rec:              0,
        pub_rec_bankruptcies: 0,
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/loans/apply/', form);
            navigate(`/result/${res.data.id}`, { state: res.data });
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

            {/* Header */}
            <div className="animate-fade-up" style={{ marginBottom: '40px' }}>
                <h1 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '36px',
                    fontWeight: '800',
                    letterSpacing: '-1px',
                    marginBottom: '10px',
                }}>Loan Risk <span style={{
                    background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>Application</span></h1>
                <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#64748b',
                    fontSize: '15px',
                }}>Fill in the applicant details below to receive an instant AI risk assessment.</p>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Full Name */}
                <div className="glass animate-fade-up" style={{ padding: '28px', marginBottom: '20px' }}>
                    <label style={{
                        fontFamily: 'Syne, sans-serif',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#60a5fa',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'block',
                        marginBottom: '10px',
                    }}>Applicant Name</label>
                    <input
                        name="full_name"
                        placeholder="Full name of the applicant"
                        required
                        value={form.full_name}
                        onChange={handleChange}
                        className="input-field"
                        style={{ fontSize: '16px' }}
                    />
                </div>

                {/* Sections */}
                {SECTIONS.map((section, si) => (
                    <div key={section.title} className="glass" style={{
                        padding: '28px',
                        marginBottom: '20px',
                        opacity: 0,
                        animation: `fadeUp 0.5s ease forwards ${0.1 + si * 0.08}s`,
                    }}>
                        {/* Section Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '20px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <span style={{ fontSize: '20px' }}>{section.icon}</span>
                            <h2 style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#f1f5f9',
                            }}>{section.title}</h2>
                        </div>

                        {/* Fields Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '16px',
                        }}>
                            {section.fields.map(field => (
                                <div key={field.name}>
                                    <label style={{
                                        fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        color: '#64748b',
                                        display: 'block',
                                        marginBottom: '6px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}>{field.label}</label>

                                    {field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            {field.options.map(o => (
                                                <option key={o} value={o}>{o}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            name={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            required={field.name !== 'mort_acc'}
                                            className="input-field"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'rgba(244,63,94,0.1)',
                        border: '1px solid rgba(244,63,94,0.3)',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        marginBottom: '20px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '14px',
                        color: '#fb7185',
                    }}>{error}</div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '16px', padding: '18px' }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            </svg>
                            Analyzing Risk...
                        </span>
                    ) : 'Predict Risk Now'}
                </button>
            </form>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}