// import { Menu, User } from "lucide-react";

// const UserNavbar = ({ onToggleSidebar }) => {
//   const username = localStorage.getItem("username") || "User";

//   return (
//     <header className="w-full bg-[#0078d4] text-white flex items-center justify-between px-6 py-3 shadow-sm">
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={onToggleSidebar}
//           className="text-white hover:text-blue-100 focus:outline-none"
//           aria-label="Toggle sidebar"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//         <h1 className="text-lg font-semibold tracking-tight">User Dashboard</h1>
//       </div>

//       <div className="flex items-center space-x-6 text-sm">
//         <div className="flex items-center space-x-2">
//           <User className="w-4 h-4 text-white" />
//           <span className="font-medium">{username}</span>
//         </div>
//         <button
//           className="hover:underline"
//           onClick={() => {
//             localStorage.clear();
//             window.location.href = "/login";
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// };

// export default UserNavbar;
