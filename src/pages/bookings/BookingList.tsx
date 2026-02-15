export default function BookingList() {
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
                                <NavItem to="/rooms">Rooms</NavItem>
                                <NavItem to="/bookings" active>Bookings</NavItem>
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
                    <h1 className="text-3xl font-bold">Available Room</h1>
                    <p className="text-gray-400 mt-1">Overview sistem booking ruangan</p>
                </div>
            </header>

      {/* CONTENT */}
            <main className="mx-auto max-w-7xl px-4 py-8">

                {/* HEADER */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">Rooms</h2>
                            <p className="text-sm text-slate-400">
                                A list of all the rooms in Electronic Engineering Polythecnic Institute of Surabaya including their name, capacity, and location.
                            </p>
                        </div>

                        <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium">
                            Add user
                        </button>
                    </div>

                {/* TABLE */}
                    <div className="overflow-hidden rounded-xl border border-slate-700">
                        <table className="min-w-full text-sm">
                          <thead className="bg-slate-800 text-slate-300">
                              <tr>
                                  <th className="px-6 py-3 text-left">#</th>
                                  <th className="px-6 py-3 text-left">Room Name</th>
                                  <th className="px-6 py-3 text-left">Capacity</th>
                                  <th className="px-6 py-3 text-left">Location</th>
                                  <th className="px-6 py-3 text-right"></th>
                              </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-700">
                              {[
                                  ["1", "SAW 08.10", "120", "Gedung SAW"],
                              ].map((user, i) => (
                                  <tr key={i} className="hover:bg-slate-800/60">
                                      <td className="px-6 py-4 font-medium">{user[0]}</td>
                                      <td className="px-6 py-4 text-slate-300">{user[1]}</td>
                                      <td className="px-6 py-4 text-slate-300">{user[2]}</td>
                                      <td className="px-6 py-4 text-slate-300">{user[3]}</td>
                                      <td className="px-6 py-4 text-right">
                                          <button className="text-indigo-400 hover:text-indigo-300">
                                            Edit
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                </table>
              </div>

            </main>
        </div>
    );
}

import { Link } from "react-router-dom";

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

// function StatCard({ title, value }: { title: string; value: string }) {
//     return (
//         <div className="bg-gray-800 border border-white/10 rounded-xl p-6">
//             <p className="text-gray-400 text-sm">{title}</p>
//             <h3 className="text-3xl font-bold mt-2">{value}</h3>
//         </div>
//     );
// }
