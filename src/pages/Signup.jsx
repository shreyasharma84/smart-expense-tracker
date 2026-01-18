import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await signup(name, email, password);
        if (result.success) {
            navigate('/');
        } else {
            const errorMsg = typeof result.error === 'object'
                ? JSON.stringify(result.error)
                : result.error;
            setError(errorMsg || 'Signup failed.');
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <div className="card glass-heavy animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', zIndex: 10 }}>
                <div className="text-center mb-8">
                    <h1 className="font-bold" style={{ fontSize: '1.5rem' }}>Create Account</h1>
                    <p className="text-muted mt-2">Start your journey to financial freedom</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'hsl(var(--danger))', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-muted font-medium" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="text-muted font-medium" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-muted font-medium" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <UserPlus size={20} />
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center" style={{ fontSize: '0.875rem' }}>
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-primary font-medium" style={{ textDecoration: 'none' }}>
                        Log in
                    </Link>
                </div>
            </div>

            {/* Background Decor */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '25%', right: '25%', width: '300px', height: '300px', background: 'hsl(var(--accent))', opacity: 0.2, filter: 'blur(100px)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '25%', left: '25%', width: '300px', height: '300px', background: 'hsl(var(--primary))', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }}></div>
            </div>
        </div>
    );
};

export default Signup;
