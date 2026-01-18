import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        updateProfile({ name });
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        // Logic to simulate password change (UI only as per requirement)
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }
        setMessage('Password changed successfully! (Mock)');
        setNewPassword('');
        setCurrentPassword('');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="mb-6 text-center">
                <h1 className="font-bold" style={{ fontSize: '2rem' }}>Profile Settings</h1>
                <p className="text-muted">Update your personal information.</p>
            </div>

            <div className="card glass" style={{ padding: '2rem' }}>
                <div className="flex flex-col items-center mb-8">
                    <div className="flex-center font-bold text-white mb-4" style={{ width: '96px', height: '96px', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', borderRadius: '50%', fontSize: '2.5rem', boxShadow: '0 10px 30px rgba(100, 100, 255, 0.2)' }}>
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <p className="font-bold" style={{ fontSize: '1.25rem' }}>{user?.name}</p>
                    <p className="text-muted">{user?.email}</p>
                </div>

                {message && (
                    <div className="mb-6" style={{ padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '8px', color: 'hsl(var(--success))', textAlign: 'center', fontSize: '0.875rem' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="flex flex-col gap-4 mb-8">
                    <h3 className="font-bold" style={{ fontSize: '1.125rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={20} className="text-primary" /> Personal Details
                    </h3>

                    <div>
                        <label className="text-muted font-medium" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-muted font-medium" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </form>

                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                    <h3 className="font-bold" style={{ fontSize: '1.125rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={20} className="text-accent" /> Security
                    </h3>

                    <div>
                        <label className="text-muted font-medium" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="btn-secondary">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
