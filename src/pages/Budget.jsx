import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const Budget = () => {
    const { budget, setMonthlyBudget, getStats } = useExpense();
    const { totalExpenses, remaining, progress, status } = getStats();
    const [newBudget, setNewBudget] = useState(budget);
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveBudget = () => {
        setMonthlyBudget(newBudget);
        setIsEditing(false);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', gap: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="text-center">
                <h1 className="font-bold" style={{ fontSize: '2rem' }}>Monthly Budget</h1>
                <p className="text-muted mt-2">Set goals and track your spending limits.</p>
            </div>

            {/* Budget Setter */}
            <div className="card glass-heavy text-center" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))' }}></div>

                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div className="mb-6 flex justify-center">
                        <div className="flex-center" style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(129, 140, 248, 0.2)', color: 'hsl(var(--primary))' }}>
                            <Target size={32} />
                        </div>
                    </div>

                    {!isEditing ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-muted font-semibold" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Budget</p>
                            <h2 className="font-bold" style={{ fontSize: '3rem', lineHeight: 1 }}>${budget.toFixed(2)}</h2>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-secondary mt-4"
                                style={{ alignSelf: 'center' }}
                            >
                                Edit Budget
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in flex flex-col gap-4">
                            <label className="text-muted block">Enter New Monthly Budget</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', fontWeight: 'bold', color: 'hsl(var(--text-muted))' }}>$</span>
                                <input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '1rem', paddingLeft: '2rem' }}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-center gap-2">
                                <button onClick={handleSaveBudget} className="btn-primary">Save Goal</button>
                                <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Visualization */}
            <div className="grid-cols-2">
                <div className="card glass" style={{ padding: '1.5rem' }}>
                    <h3 className="font-bold mb-4 flex items-center">
                        <TrendingUp size={20} className="text-secondary" style={{ marginRight: '0.5rem' }} />
                        Spending Overview
                    </h3>

                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex justify-between" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span className="text-muted">Spent</span>
                                <span className="font-bold">${totalExpenses.toFixed(2)}</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '100%', background: 'hsl(var(--secondary))', opacity: 0.5 }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <span className="text-muted">Remaining</span>
                                <span className={`font-bold ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
                                    ${remaining.toFixed(2)}
                                </span>
                            </div>
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${remaining < 0 ? 0 : (remaining / budget) * 100}%`,
                                        backgroundColor: remaining < 0 ? 'hsl(var(--danger))' : 'hsl(var(--success))'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card glass flex-center flex-col text-center" style={{ padding: '1.5rem' }}>
                    {status === 'danger' ? (
                        <>
                            <div className="flex-center mb-4" style={{ width: '64px', height: '64px', background: 'rgba(240, 68, 68, 0.2)', borderRadius: '50%', color: 'hsl(var(--danger))' }}>
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-danger font-bold" style={{ fontSize: '1.25rem' }}>Budget Exceeded!</h3>
                            <p className="text-muted mt-2">You have spent ${(totalExpenses - budget).toFixed(2)} over your limit.</p>
                        </>
                    ) : status === 'warning' ? (
                        <>
                            <div className="flex-center mb-4" style={{ width: '64px', height: '64px', background: 'rgba(250, 204, 21, 0.2)', borderRadius: '50%', color: 'hsl(var(--warning))' }}>
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-warning font-bold" style={{ fontSize: '1.25rem' }}>Approaching Limit</h3>
                            <p className="text-muted mt-2">You have used {progress.toFixed(1)}% of your monthly budget.</p>
                        </>
                    ) : (
                        <>
                            <div className="flex-center mb-4" style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', color: 'hsl(var(--success))' }}>
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-success font-bold" style={{ fontSize: '1.25rem' }}>On Track</h3>
                            <p className="text-muted mt-2">You are well within your budget limits. Keep it up!</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;
