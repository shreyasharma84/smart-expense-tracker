import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Plus, Trash2, Edit2, X, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatCurrency';

const Expenses = () => {
    const { expenses, addExpense, deleteExpense, editExpense } = useExpense();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Utilities', 'Health', 'Other'];
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const initialFormState = {
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleOpenModal = (expense = null) => {
        if (expense) {
            setCurrentExpense(expense);
            setFormData(expense);
        } else {
            setCurrentExpense(null);
            setFormData(initialFormState);
            setIsCustomCategory(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentExpense(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentExpense) {
            editExpense(currentExpense.id, formData);
        } else {
            addExpense(formData);
        }
        handleCloseModal();
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <div>
                    <h1 className="font-bold" style={{ fontSize: '2rem' }}>Expenses</h1>
                    <p className="text-muted">Manage your daily spending.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                >
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Add Expense
                </button>
            </div>

            {/* Filters */}
            <div className="card glass flex gap-4 p-4 mb-6" style={{ padding: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
                <div style={{ position: 'relative', width: '200px' }}>
                    <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Expense List */}
            <div className="flex flex-col gap-4">
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-8 text-muted" style={{ padding: '3rem 0', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p className="text-lg">No expenses found matching your criteria.</p>
                    </div>
                ) : (
                    filteredExpenses.map((expense) => (
                        <div key={expense.id} className="card glass" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="flex items-center gap-4">
                                <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {expense.category === 'Food' ? '🍔' :
                                        expense.category === 'Travel' ? '✈️' :
                                            expense.category === 'Shopping' ? '🛍️' : '📄'}
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ fontSize: '1.125rem' }}>{expense.category}</h3>
                                    <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.875rem' }}>
                                        <span>{format(new Date(expense.date), 'MMMM dd, yyyy')}</span>
                                        {expense.description && (
                                            <>
                                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'hsl(var(--text-muted))' }}></span>
                                                <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expense.description}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="font-bold" style={{ fontSize: '1.25rem' }}>
                                    -{formatCurrency(expense.amount)}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(expense)}
                                        className="btn-icon-only"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteExpense(expense.id)}
                                        className="btn-icon-only"
                                        style={{ color: 'hsl(var(--danger))' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="overlay flex-center" style={{ padding: '1rem' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', background: 'hsl(var(--bg-card))', boxShadow: 'var(--shadow-md)' }}>
                        <div className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <h2 className="font-bold" style={{ fontSize: '1.25rem' }}>
                                {currentExpense ? 'Edit Expense' : 'Add New Expense'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="btn-icon-only"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ padding: '1.5rem' }}>
                            <div>
                                <label className="text-muted font-medium mb-4" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Category</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, category: cat });
                                                setIsCustomCategory(false);
                                            }}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                border: formData.category === cat && !isCustomCategory ? '1px solid hsl(var(--primary))' : '1px solid rgba(255,255,255,0.1)',
                                                background: formData.category === cat && !isCustomCategory ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
                                                color: formData.category === cat && !isCustomCategory ? 'white' : 'hsl(var(--text-muted))',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, category: '' });
                                            setIsCustomCategory(true);
                                        }}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            border: isCustomCategory ? '1px solid hsl(var(--primary))' : '1px solid rgba(255,255,255,0.1)',
                                            background: isCustomCategory ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
                                            color: isCustomCategory ? 'white' : 'hsl(var(--text-muted))',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        + Custom
                                    </button>
                                </div>
                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="mt-2"
                                        autoFocus
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <label className="text-muted font-medium" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="text-muted font-medium" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-muted font-medium" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Description (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Dinner with friends..."
                                />
                            </div>

                            <div style={{ paddingTop: '1rem' }}>
                                <button type="submit" className="btn-primary w-full">
                                    {currentExpense ? 'Save Changes' : 'Add Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
