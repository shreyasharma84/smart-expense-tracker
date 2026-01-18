import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(0);

    // Load data when user changes
    useEffect(() => {
        if (user) {
            const storedExpenses = localStorage.getItem(`expenses_${user.id}`);
            const storedBudget = localStorage.getItem(`budget_${user.id}`);

            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
            else setExpenses([]);

            if (storedBudget) setBudget(parseFloat(storedBudget));
            else setBudget(0);
        } else {
            setExpenses([]);
            setBudget(0);
        }
    }, [user]);

    // Save data whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`expenses_${user.id}`, JSON.stringify(expenses));
        }
    }, [expenses, user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`budget_${user.id}`, budget.toString());
        }
    }, [budget, user]);

    const addExpense = (expense) => {
        const newExpense = {
            ...expense,
            id: Date.now().toString(),
            amount: parseFloat(expense.amount),
            date: expense.date || new Date().toISOString().split('T')[0]
        };
        setExpenses(prev => [newExpense, ...prev]);
    };

    const deleteExpense = (id) => {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
    };

    const editExpense = (id, updatedData) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, ...updatedData, amount: parseFloat(updatedData.amount) } : exp
        ));
    };

    const setMonthlyBudget = (amount) => {
        setBudget(parseFloat(amount));
    };

    const getStats = () => {
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = budget - totalExpenses;
        const progress = budget > 0 ? (totalExpenses / budget) * 100 : 0;

        let status = 'good';
        if (progress >= 100) status = 'danger';
        else if (progress >= 80) status = 'warning';

        return {
            totalExpenses,
            remaining,
            progress,
            status
        };
    };

    const value = {
        expenses,
        budget,
        addExpense,
        deleteExpense,
        editExpense,
        setMonthlyBudget,
        getStats
    };

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
};
