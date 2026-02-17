import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

export default function EditBooking() {
    const { id } = useParams();
    const [booking, setBooking] = useState<any>(null);

    const [borrowerName, setBorrowerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [rooms, setRooms] = useState<any[]>([]);

    const [errors, setErrors] = useState<{
        roomId?: string;
        startTime?: string;
        endTime?: string;
        global?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/rooms?pageSize=100")
            .then(res => setRooms(res.data.data));
        api.get(`/bookings/${id}`)
            .then(res => setBooking(res.data));
    }, [id]);

    useEffect(() => {
        if (booking && rooms.length > 0) {
            setBorrowerName(booking.borrowerName);
            setRoomId(String(booking.roomId));
            setStartTime(booking.startTime.slice(0, 16));
            setEndTime(booking.endTime.slice(0, 16));
        }
    }, [booking, rooms]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            setLoading(true);
            await api.put(`/bookings/${id}`, {
                roomId: Number(roomId),
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
            });
            navigate("/bookings");
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors) {
                setErrors({
                    roomId: data.errors.RoomId?.[0],
                    startTime: data.errors.StartTime?.[0],
                    endTime: data.errors.EndTime?.[0],
                });
            }
            if (data?.message) {
                setErrors({ global: data.message });
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
                                <NavItem to="/rooms">Room</NavItem>
                                <NavItem to="/bookings" active>Booking</NavItem>
                                <NavItem to="/histories">History</NavItem>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full hover:bg-white/10">🔔</button>
                            <img 
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                                className="h-9 w-9 rounded-full object-cover border border-white/20"
                                alt="User"
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
                            Edit Booking
                        </h2>
                        {errors.global && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                                {errors.global}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="Borrower Name" value={borrowerName} onChange={setBorrowerName} disabled/>
                            <Select label="Room" value={roomId} onChange={setRoomId} error={errors.roomId} options={rooms.map(room => ({ label: room.name, value: String(room.id) }))}/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Start Time" type="datetime-local" value={startTime} onChange={setStartTime} error={errors.startTime}/>
                                <Input label="End Time" type="datetime-local" value={endTime} onChange={setEndTime} error={errors.endTime}/>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                                <ButtonLink to="/bookings">Cancel</ButtonLink>
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
    type = "text",
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    type?: string;
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full bg-slate-700/40 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2
                    ${error ? "border-red-500 focus:ring-red-500" : "border-slate-600 focus:ring-indigo-500"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
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
    options: { label: string; value: string }[];
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
                        Select a room
                    </option>
                    {options.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-slate-900 text-white"
                        >
                            {opt.label}
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