import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ArrowUpRight, Wallet, PieChart, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const { expenses, budget, getStats } = useExpense();
    const { totalExpenses, remaining, progress, status } = getStats();

    const recentExpenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    const categoryData = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: ['#818cf8', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa'],
                borderWidth: 0,
            },
        ],
    };

    const pieOptions = {
        cutout: '70%',
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 6 }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="font-bold" style={{ fontSize: '2rem', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Hello, {user?.name} 👋
                </h1>
                <p className="text-muted mt-2">Here's your financial overview for this month.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid-cols-3 mb-8">
                {/* Total Expenses Card */}
                <div className="card glass stat-card">
                    <div className="stat-glow" style={{ background: 'hsl(var(--primary))' }}></div>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-muted font-medium" style={{ fontSize: '0.875rem' }}>Total Spent</p>
                            <h3 className="font-bold" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>${totalExpenses.toFixed(2)}</h3>
                            <div className="flex items-center mt-2 text-danger" style={{ fontSize: '0.875rem' }}>
                                <ArrowUpRight size={16} style={{ marginRight: '0.25rem' }} />
                                <span>+2.5% vs last month</span>
                            </div>
                        </div>
                        <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.2)', color: 'hsl(var(--primary))' }}>
                            <Wallet size={24} />
                        </div>
                    </div>
                </div>

                {/* Remaining Budget Card */}
                <div className="card glass stat-card">
                    <div className="stat-glow" style={{ background: 'hsl(var(--secondary))' }}></div>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-muted font-medium" style={{ fontSize: '0.875rem' }}>Remaining Budget</p>
                            <h3 className="font-bold" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>${remaining.toFixed(2)}</h3>
                            <div className="flex items-center mt-2 text-success" style={{ fontSize: '0.875rem' }}>
                                <Wallet size={16} style={{ marginRight: '0.25rem' }} />
                                <span>of ${budget.toFixed(2)} Budget</span>
                            </div>
                        </div>
                        <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.2)', color: 'hsl(var(--secondary))' }}>
                            <PieChart size={24} />
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="progress-bar-bg mt-4">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${Math.min(progress, 100)}%`,
                                backgroundColor: status === 'danger' ? 'hsl(var(--danger))' : status === 'warning' ? 'hsl(var(--warning))' : 'hsl(var(--success))'
                            }}
                        />
                    </div>
                </div>

                {/* Budget Status Card */}
                <div className="card glass stat-card">
                    <div className="stat-glow" style={{ background: 'hsl(var(--accent))' }}></div>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-muted font-medium" style={{ fontSize: '0.875rem' }}>Budget Status</p>
                            <h3 className={`font-bold ${status === 'danger' ? 'text-danger' : status === 'warning' ? 'text-warning' : 'text-success'}`} style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                                {status === 'danger' ? 'Over Budget' : status === 'warning' ? 'Near Limit' : 'On Track'}
                            </h3>
                            <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
                                {status === 'danger' ? 'Please review your spending.' : 'Keep up the good work!'}
                            </p>
                        </div>
                        <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
                            {status === 'danger' || status === 'warning' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                {/* Recent Transactions */}
                <div className="card glass" style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold" style={{ fontSize: '1.125rem' }}>Recent Transactions</h3>
                        <button className="text-primary" style={{ fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {recentExpenses.length === 0 ? (
                            <div className="text-center py-8 text-muted">No expenses recorded yet.</div>
                        ) : (
                            recentExpenses.map((expense) => (
                                <div key={expense.id} className="transaction-item">
                                    <div className="flex items-center">
                                        <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', fontSize: '1.25rem', marginRight: '1rem' }}>
                                            {'🛒'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{expense.category}</p>
                                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">-${expense.amount.toFixed(2)}</p>
                                        {expense.description && <p className="text-muted" style={{ fontSize: '0.75rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expense.description}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="card glass flex flex-col" style={{ padding: '1.5rem' }}>
                    <h3 className="font-bold mb-4" style={{ fontSize: '1.125rem' }}>Spending by Category</h3>
                    <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
                        {expenses.length > 0 ? (
                            <Doughnut data={pieData} options={pieOptions} />
                        ) : (
                            <div className="flex-center h-full text-muted" style={{ fontSize: '0.875rem' }}>No data to display</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
