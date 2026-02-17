import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

type DashboardStat = {
    totalRooms: number;
    bookingsToday: number;
    pendingRequests: number;
};

export default function Dashboard() {
    const [stat, setStat] = useState<DashboardStat>({
        totalRooms: 0,
        bookingsToday: 0,
        pendingRequests: 0
    });

    const fetchDashboard = async () => {
        const res = await api.get("/dashboard");
        setStat(res.data);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="min-h-screen w-screen bg-gray-900 text-white">
            {/* NAVBAR */}
            <nav className="bg-gray-800/60 border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-10">
                            <div className="text-xl font-bold text-indigo-400">BookSpace</div>
                            <div className="hidden md:flex space-x-4">
                                <NavItem to="/" active>Dashboard</NavItem>
                                <NavItem to="/rooms">Room</NavItem>
                                <NavItem to="/bookings">Booking</NavItem>
                                <NavItem to="/histories">History</NavItem>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full hover:bg-white/10">🔔</button>
                            <img 
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                className="h-9 w-9 rounded-full object-cover border border-white/20"
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            <header className="border-b border-white/10 bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Overview room booking system</p>
                </div>
            </header>

            {/* MAIN */}
            <main className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Rooms" value={stat.totalRooms.toString()} />
                <StatCard title="Bookings Today" value={stat.bookingsToday.toString()} />
                <StatCard title="Pending Requests" value={stat.pendingRequests.toString()} />
                {/* <div className="md:col-span-3 bg-gray-800 border border-white/10 rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="text-gray-400 text-sm">Belum ada aktivitas terbaru.</div>
                </div> */}
            </main>
        </div>
    );
}

type NavItemProps = {
    to: string;
    children: string;
    active?: boolean;
};

function NavItem({ to, children, active = false }: NavItemProps) {
    return (
        <Link
            to={to}
            className={`px-3 py-2 rounded-md text-sm font-medium transition
                ${active
                    ? "bg-gray-950/50 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
        >
            {children}
        </Link>
    );
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-gray-800 border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
    );
}
