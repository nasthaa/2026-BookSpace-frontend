import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Room } from "../../services/api";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 8;
    const [total, setTotal] = useState(0);
    const totalPages = Math.ceil(total / pageSize);
    
    const navigate = useNavigate();

    const fetchRooms = async () => {
        const res = await api.get(`/rooms?page=${page}&pageSize=${pageSize}`);
        setRooms(res.data.data);
        setTotal(res.data.total);
    };
    
    const handleEdit = (id: number) => {
        navigate(`/rooms/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        await api.delete(`/rooms/${id}`);
        setOpenDelete(false);
        fetchRooms();
    };

    useEffect(() => {
        fetchRooms();
    }, [page]);

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
                                <NavItem to="/rooms" active>Rooms</NavItem>
                                <NavItem to="/bookings">Bookings</NavItem>
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
                        <h2 className="text-lg font-semibold">Rooms</h2>
                        <p className="text-sm text-slate-400">
                            A list of all the rooms.
                        </p>
                    </div>
                    <ButtonLink to="/rooms/create">
                        Create New Room
                    </ButtonLink>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-700">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-800 text-slate-300">
                            <tr>
                                <th className="px-6 py-3 text-left">#</th>
                                <th className="px-6 py-3 text-left">Room Name</th>
                                <th className="px-6 py-3 text-left">Capacity</th>
                                <th className="px-6 py-3 text-left">Location</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {rooms.map((room, i) => (
                                <tr key={room.id} className="hover:bg-slate-800/60">
                                    <td className="px-6 py-4">
                                        {(page - 1) * pageSize + i + 1}
                                    </td>
                                    <td
                                        className="px-6 py-4 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setOpenDetail(true);
                                        }}
                                    >
                                        {room.name}
                                    </td>
                                    <td className="px-6 py-4">{room.capacity}</td>
                                    <td className="px-6 py-4">{room.location}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <button
                                            onClick={() => handleEdit(room.id)}
                                            className="text-indigo-400 hover:text-indigo-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setOpenDelete(true);
                                            }}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                        Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded ${
                                page === i + 1
                                    ? "bg-indigo-600"
                                    : "bg-white/5 hover:bg-white/10"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>

            <Dialog open={openDelete} onClose={setOpenDelete} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/60" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-xl bg-gray-800 p-6 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-500/10">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-white">
                                    Delete Room
                                </DialogTitle>
                                <p className="text-sm text-gray-400">
                                    Yakin hapus room <b>{selectedRoom?.name}</b>?
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setOpenDelete(false)}
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!selectedRoom) return;
                                    await handleDelete(selectedRoom.id);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            
            <Dialog open={openDetail} onClose={setOpenDetail} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/60" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md rounded-xl bg-gray-800 p-6 border border-white/10">
                        <DialogTitle className="text-lg font-semibold text-white mb-4">
                            Room Detail
                        </DialogTitle>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-400">Room Name</p>
                                <p className="font-semibold">{selectedRoom?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Capacity</p>
                                <p className="font-semibold">{selectedRoom?.capacity}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Location</p>
                                <p className="font-semibold">{selectedRoom?.location}</p>
                            </div>
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

function ButtonLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link
            to={to} 
            className="bg-indigo-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
        >
            {children}
        </Link>
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
