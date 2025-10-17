// components/Header.js
import { Menu } from "lucide-react";

interface HeaderProps {
    toggleSidebar: () => void;
}
export default function Header({ toggleSidebar }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md h-16 flex items-center px-4">
            <button onClick={toggleSidebar} className="text-gray-700">
                <Menu size={28} />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Habit Tracker</h1>
        </header>
    );
}
