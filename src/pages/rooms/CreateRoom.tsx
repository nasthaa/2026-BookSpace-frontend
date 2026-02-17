import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function CreateRoom() {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [location, setLocation] = useState("");
    
    const buildings = [
        "Gedung D3",
        "Gedung D4",
        "Gedung Pasca Sarjana",
        "Gedung SAW",
        "Aula Serbaguna",
        "Lapangan Olahraga",
        "Lapangan Parkir",
    ];

    const [errors, setErrors] = useState<{
        name?: string;
        capacity?: string;
        location?: string;
        global?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            setLoading(true);
            await api.post("/rooms", {
                name,
                capacity: Number(capacity),
                location,
            });
            navigate("/rooms");
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors) {
                setErrors({
                    name: data.errors.Name?.[0],
                    capacity: data.errors.Capacity?.[0],
                    location: data.errors.Location?.[0],
                });
            }
            if (!data?.errors && !data?.message) {
                setErrors({ global: "An error has occurred, please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gray-900 text-white">
            {/* NAVBAR */}
            <nav className="bg-gray-800/60 border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-10">
                            <div className="text-xl font-bold text-indigo-400">BookSpace</div>
                            <div className="hidden md:flex space-x-4">
                                <NavItem to="/">Dashboard</NavItem>
                                <NavItem to="/rooms" active>Room</NavItem>
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

            {/* CONTENT */}
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="bg-slate-900 flex items-center justify-center px-4 py-6">
                    <div className="w-full max-w-4xl bg-slate-800/70 border border-slate-700 rounded-2xl p-8">
                        <h2 className="text-xl font-semibold mb-6">
                            Add New Room
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="Room name" value={name} onChange={setName} error={errors.name}/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Capacity" value={capacity} onChange={setCapacity} error={errors.capacity}/>
                                {/* <Input label="Location" value={location} onChange={setLocation} error={errors.location}/> */}
                                <Select label="Location" value={location} onChange={setLocation} error={errors.location} options={buildings}/>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                                <ButtonLink to="/rooms">Cancel</ButtonLink>
                                <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium">
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
            ${
                active
                    ? "bg-gray-950/50 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
        >
            {children}
        </Link>
    );
}

function Input({
    label,
    value,
    onChange,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {label}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full bg-slate-700/40 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2
                    ${error ? "border-red-500 focus:ring-red-500" : "border-slate-600 focus:ring-indigo-500"}
                `}
            />
            {error && (
                <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full bg-slate-700/40 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 appearance-none
                        ${error 
                            ? "border-red-500 focus:ring-red-500/50" 
                            : "border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/40"
                        }
                    `}
                >
                    <option value="" disabled hidden>
                        Select a location
                    </option>
                    {options.map((opt) => (
                        <option
                            key={opt}
                            value={opt}
                            className="bg-slate-900 text-white"
                        >
                            {opt}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
}

function ButtonLink({
    to,
    children,
}: {
    to: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            to={to}
            className="bg-blue-500 hover:bg-blue-300 px-4 py-2 rounded-lg text-sm font-medium text-white"
        >
            {children}
        </Link>
    );
}
