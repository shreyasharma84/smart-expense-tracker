import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    Wallet,
    UserCircle,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/expenses', icon: Receipt, label: 'Expenses' },
        { to: '/budget', icon: Wallet, label: 'Budget' },
        { to: '/analytics', icon: PieChart, label: 'Analytics' },
        { to: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    return (
        <div className="app-container">
            {/* Mobile Header */}
            <div className="mobile-header glass">
                <h1 className="font-bold text-primary" style={{ fontSize: '1.25rem' }}>
                    FinanceFlow
                </h1>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="btn-icon-only"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`sidebar glass-heavy ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="flex items-center" style={{ height: '64px', padding: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex-center font-bold text-white" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'hsl(var(--primary))', marginRight: '0.75rem' }}>F</div>
                    <span className="font-bold" style={{ fontSize: '1.25rem' }}>FinanceFlow</span>
                </div>

                <div className="flex-1 overflow-y-auto" style={{ padding: '1.5rem 0.75rem' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} style={{ marginRight: '0.75rem' }} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '0.75rem' }}>
                        <div className="flex-center font-bold text-white" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', marginRight: '0.75rem' }}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p className="font-medium" style={{ fontSize: '0.875rem' }}>{user?.name}</p>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary w-full"
                        style={{ justifyContent: 'center' }}
                    >
                        <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
