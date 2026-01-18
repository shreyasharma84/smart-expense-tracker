import { useExpense } from '../context/ExpenseContext';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
    const { expenses } = useExpense();

    // Process data for charts
    const categoryData = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const datesData = expenses.reduce((acc, curr) => {
        // Group by month
        const month = new Date(curr.date).toLocaleDateString('default', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + curr.amount;
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa', '#f87171', '#c084fc'
                ],
                borderWidth: 0,
            },
        ],
    };

    const barData = {
        labels: Object.keys(datesData),
        datasets: [
            {
                label: 'Monthly Spending',
                data: Object.values(datesData),
                backgroundColor: '#818cf8',
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8' }
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="animate-fade-in flex flex-col gap-6">
            <div className="mb-6">
                <h1 className="font-bold" style={{ fontSize: '2rem' }}>Analytics</h1>
                <p className="text-muted">Visual insights into your financial habits.</p>
            </div>

            <div className="grid-cols-2">
                <div className="card glass flex flex-col" style={{ padding: '1.5rem', height: '400px' }}>
                    <h3 className="font-bold mb-4" style={{ fontSize: '1.125rem' }}>Category Distribution</h3>
                    <div style={{ flex: 1, position: 'relative' }}>
                        {Object.keys(categoryData).length > 0 ? (
                            <Doughnut
                                data={pieData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
                                }}
                            />
                        ) : (
                            <div className="flex-center h-full text-muted">No data available</div>
                        )}
                    </div>
                </div>

                <div className="card glass flex flex-col" style={{ padding: '1.5rem', height: '400px' }}>
                    <h3 className="font-bold mb-4" style={{ fontSize: '1.125rem' }}>Monthly Trends</h3>
                    <div style={{ flex: 1, position: 'relative' }}>
                        {Object.keys(datesData).length > 0 ? (
                            <Bar data={barData} options={options} />
                        ) : (
                            <div className="flex-center h-full text-muted">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Insight Card */}
            <div className="card glass" style={{ padding: '1.5rem' }}>
                <h3 className="font-bold mb-4" style={{ fontSize: '1.125rem' }}>Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Most Expensive Category</p>
                        <p className="text-primary font-bold mt-2" style={{ fontSize: '1.25rem' }}>
                            {Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Average Transaction</p>
                        <p className="text-secondary font-bold mt-2" style={{ fontSize: '1.25rem' }}>
                            ${expenses.length > 0 ? (expenses.reduce((a, b) => a + b.amount, 0) / expenses.length).toFixed(2) : '0.00'}
                        </p>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Transactions</p>
                        <p className="text-accent font-bold mt-2" style={{ fontSize: '1.25rem' }}>
                            {expenses.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
