import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/axios';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(0);

    // Load data when user changes
    useEffect(() => {
        if (user) {
            fetchExpenses();
            fetchBudget();
        } else {
            setExpenses([]);
            setBudget(0);
        }
    }, [user]);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('expenses/');
            // API returns decimal as string usually, ensure proper parsing if needed
            const formatted = res.data.map(e => ({
                ...e,
                amount: parseFloat(e.amount)
            }));
            setExpenses(formatted);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        }
    }

    const fetchBudget = async () => {
        try {
            const res = await api.get('budget/');
            setBudget(parseFloat(res.data.amount || 0));
        } catch (error) {
            console.error("Failed to fetch budget", error);
        }
    }

    const addExpense = async (expense) => {
        try {
            const res = await api.post('expenses/', expense);
            const newExpense = { ...res.data, amount: parseFloat(res.data.amount) };
            setExpenses(prev => [newExpense, ...prev]);
            return { success: true };
        } catch (error) {
            console.error("Add failed", error);
            return { success: false };
        }
    };

    const deleteExpense = async (id) => {
        try {
            await api.delete(`expenses/${id}/`);
            setExpenses(prev => prev.filter(exp => exp.id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const editExpense = async (id, updatedData) => {
        try {
            const res = await api.patch(`expenses/${id}/`, updatedData);
            setExpenses(prev => prev.map(exp =>
                exp.id === id ? { ...res.data, amount: parseFloat(res.data.amount) } : exp
            ));
        } catch (error) {
            console.error("Edit failed", error);
        }
    };

    const setMonthlyBudget = async (amount) => {
        try {
            const res = await api.put('budget/', { amount });
            setBudget(parseFloat(res.data.amount));
        } catch (error) {
            console.error("Set budget failed", error);
        }
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
