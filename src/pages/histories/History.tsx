import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Booking } from "../../services/api";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [page, setPage] = useState(1);
    const pageSize = 8;
    const [total, setTotal] = useState(0);
    const totalPages = Math.ceil(total / pageSize);

    const fetchBookings = async () => {
        const res = await api.get(
            `/histories?page=${page}&pageSize=${pageSize}&search=${search}&status=${status}`
        );
        setBookings(res.data.data);
        setTotal(res.data.total);
    };

    useEffect(() => {
        fetchBookings();
    }, [page, search, status]);

    const getStatusBadge = (status: string) => {
        let color = "";
        let label = status;
        
        switch (status) {
            case "Pending":
                color = "bg-yellow-500/20 text-yellow-400";
                break;
            case "Approved":
                color = "bg-blue-500/20 text-blue-400";
                break;
            case "OnGoing":
                color = "bg-green-200/20 text-green-100";
                label = "On Going";
                break;
            case "Completed":
                color = "bg-green-500/20 text-green-400";
                break;
            case "Expired":
                color = "bg-gray-500/20 text-gray-400";
                break;
            case "Rejected":
                color = "bg-red-500/20 text-red-400";
                break;
            case "Deleted":
                color = "bg-red-200/20 text-red-100";
                break;
            default:
                color = "bg-gray-500/20 text-gray-400";
        }
        
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${color}`}>
                {label}
            </span>
        );
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
                                <NavItem to="/bookings">Booking</NavItem>
                                <NavItem to="/histories" active>History</NavItem>
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
            {/* <header className="border-b border-white/10 bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-3xl font-bold">Rooms</h1>
                    <p className="text-gray-400 mt-1">A list of all the rooms.</p>
                </div>
            </header> */}

            {/* CONTENT */}
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-semibold">Bookings</h2>
                        <p className="text-sm text-slate-400">
                            A list of all room booking requests.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search name or room..."
                            className="px-3 py-2 rounded-md bg-slate-800 border border-slate-600 text-sm"
                        />

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 py-2 rounded-md bg-slate-800 border border-slate-600 text-sm"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="OnGoing">On Going</option>
                            <option value="Completed">Completed</option>
                            <option value="Expired">Expired</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Deleted">Deleted</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-700">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-800 text-slate-300">
                            <tr>
                                <th className="px-6 py-3 text-left">#</th>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Room</th>
                                <th className="px-6 py-3 text-left">Start</th>
                                <th className="px-6 py-3 text-left">End</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {bookings.map((book, index) => {
                                return (
                                    <tr key={book.id} className="hover:bg-slate-800/60">
                                        <td className="px-6 py-4">
                                            {(page - 1) * pageSize + index + 1}
                                        </td>
                                        <td
                                        className="px-6 py-4 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                                        onClick={() => {
                                                setSelectedBooking(book);
                                                setOpenDetail(true);
                                            }}
                                        >
                                            {book.borrowerName}
                                        </td>
                                        <td className="px-6 py-4">{book.room?.name}</td>
                                        <td className="px-6 py-4">{new Date(book.startTime).toLocaleString()}</td>
                                        <td className="px-6 py-4">{new Date(book.endTime).toLocaleString()}</td>
                                        <td className="px-6 py-4">{getStatusBadge(book.status)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-slate-400">
                        Showing {(page - 1) * 8 + 1} to {Math.min(page * 8, total)} of {total}
                    </p>
                    <div className="flex gap-1">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page => page - 1)}
                            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setPage(index + 1)}
                                className={`px-3 py-1 rounded ${
                                page === index + 1
                                    ? "bg-indigo-600"
                                    : "bg-white/5 hover:bg-white/10"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page => page + 1)}
                            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>

            <Dialog open={openDetail} onClose={setOpenDetail} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/60" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-xl bg-gray-800 p-6 border border-white/10">
                        <DialogTitle className="text-lg font-semibold text-white mb-4">
                            Booking Detail
                        </DialogTitle>
                        <div className="space-y-3 text-sm">
                            <Detail label="Borrower" value={selectedBooking?.borrowerName} />
                            <Detail label="Room" value={selectedBooking?.room?.name} />
                            <Detail 
                                label="Start" 
                                value={selectedBooking?.startTime 
                                    ? new Date(selectedBooking.startTime).toLocaleString() 
                                    : "-"
                                } 
                            />
                            <Detail 
                                label="End" 
                                value={selectedBooking?.endTime 
                                    ? new Date(selectedBooking.endTime).toLocaleString() 
                                    : "-"
                                } 
                            />
                            {selectedBooking && (
                                <div>
                                    <p className="text-gray-400">Status</p>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setOpenDetail(false)}
                                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                            >
                                Close
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}

function Detail({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-gray-400">{label}</p>
            <p className="font-semibold">{value}</p>
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
