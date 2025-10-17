import { FiUsers, FiCalendar, FiHome, FiUserPlus, FiFileText, FiLogOut } from "react-icons/fi";

const SidebarItem = ({ icon, text, active, onClick, drawerOpen }: { icon: any, text: string, active: boolean, onClick: any, drawerOpen: boolean }) => (
    <div onClick={() => onClick(text)} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${active ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
        {icon}
        {drawerOpen && <span>{text}</span>}
    </div>
);

export default function Sidebar({ activePage, onNavigate, isOpen }: { activePage: string, onNavigate: any, isOpen: boolean }) {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg h-full transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      <div className="p-4 space-y-4 pt-8">
        <SidebarItem icon={<FiUsers />} text="Employees" active={activePage === "Employees"} onClick={onNavigate} drawerOpen={isOpen} />
        <SidebarItem icon={<FiHome />} text="Stats" active={activePage === "Stats"} onClick={onNavigate} drawerOpen={isOpen} />
        <SidebarItem icon={<FiUserPlus />} text="User Management" active={activePage === "User Management"} onClick={onNavigate} drawerOpen={isOpen} />
        <SidebarItem icon={<FiCalendar />} text="Report" active={activePage === "Report"} onClick={onNavigate} drawerOpen={isOpen} />
        <SidebarItem icon={<FiFileText />} text="Activity" active={activePage === "Activity"} onClick={onNavigate} drawerOpen={isOpen} />
        <SidebarItem icon={<FiFileText />} text="Dropbox" active={activePage === "Dropbox"} onClick={onNavigate} drawerOpen={isOpen} />
        <SidebarItem icon={<FiFileText />} text="New" active={activePage === "New"} onClick={onNavigate} drawerOpen={isOpen} />
      </div>
    </div>
  );
}

