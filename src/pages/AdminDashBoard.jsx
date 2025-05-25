import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getLoans,deleteLoan,deleteUser } from "../api/auth";
import AdminSideBar from "../components/AdminSideBar";
import Navbar from "../components/Navbar";
import { Pencil, Trash2 } from "lucide-react";
import UserForm from "../components/UserForm";
import LoanForm from "../components/LoanForm";

function AdminDashBoard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);


  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedItems = (items, keyMap) => {
    return [...items]
      .filter((item) =>
        Object.values(keyMap(item))
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valA = keyMap(a)[sortConfig.key];
        const valB = keyMap(b)[sortConfig.key];
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  };

    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const loansData = await getLoans();
        setUsers(usersData);
        setLoans(loansData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        username="John Doe"
      />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && <AdminSideBar setActiveTab={setActiveTab} />}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {/* USERS TAB */}
{activeTab === "users" && (
  <div>
    {isUserFormOpen ? (
      <UserForm
        user={editingUser}
        onClose={() => setIsUserFormOpen(false)}
        onSuccess={() => {
          setIsUserFormOpen(false);
          fetchData();
          // Optional: refresh users
        }}
      />
    ) : (
      <>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 select-none">
              🔍
            </span>
          </div>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded 
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400
              transition-colors duration-200 ease-in-out"
            onClick={() => {
              setEditingUser(null); // for "Add"
              setIsUserFormOpen(true);
            }}
            aria-label="Add User"
          >
            Add User
          </button>
        </div>
        <table className="min-w-full bg-white shadow rounded-lg border-collapse">
          <thead className="bg-blue-500">
            <tr>
              <th
                onClick={() => handleSort("id")}
                className="px-4 py-3 text-left font-semibold text-white cursor-pointer select-none hover:opacity-90"
              >
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("name")}
                className="px-4 py-3 text-left font-semibold text-white cursor-pointer select-none hover:opacity-90"
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems(users, (u) => ({
              id: u.id.toString(),
              name: u.name,
            })).map((user, idx) => (
              <tr
                key={user.id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2 flex space-x-3">
                  <button
                    title="Edit User"
                    onClick={() => {
                      console.log("show form");
                      setEditingUser(user);
                      setIsUserFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    <Pencil />
                  </button>
                  <button
                    title="Delete User"
                    key={user.id}
                    onClick={async () => {
                      await deleteUser(user.id);
                      fetchData();
                    }}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
)}


          {/* LOANS TAB */}
{activeTab === "loans" && (
  <div>
    {isLoanFormOpen ? (
      <LoanForm
        loan={editingLoan}
        onClose={() => setIsLoanFormOpen(false)}
        onSuccess={() => {
          setIsLoanFormOpen(false);
          fetchData();
          // Optional: refresh loans here if needed
        }}
      />
    ) : (
      <>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 select-none">
              🔍
            </span>
          </div>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded 
              hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400
              transition-colors duration-200 ease-in-out"
            onClick={() => {
              setEditingLoan(null); // For "Add" form, clear editingLoan
              setIsLoanFormOpen(true);
            }}
            aria-label="Add Loan"
          >
            Add Loan
          </button>
        </div>
        <table className="min-w-full bg-white shadow rounded-lg border-collapse">
          <thead className="bg-blue-500">
            <tr>
              <th
                onClick={() => handleSort("id")}
                className="px-4 py-3 text-left font-semibold text-white cursor-pointer select-none hover:opacity-90"
              >
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("loanType")}
                className="px-4 py-3 text-left font-semibold text-white cursor-pointer select-none hover:opacity-90"
              >
                Loan Type{" "}
                {sortConfig.key === "loanType" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems(loans, (l) => ({
              id: l.id.toString(),
              loanType: l.loanType,
            })).map((loan, idx) => (
              <tr
                key={loan.id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-2">{loan.id}</td>
                <td className="px-4 py-2">{loan.loanType}</td>
                <td className="px-4 py-2 flex space-x-3">
                  <button
                    title="Edit Loan"
                    onClick={() => {
                      console.log(loan);
                      setEditingLoan(loan);
                      setIsLoanFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    <Pencil />
                  </button>
                  <button
                    title="Delete Loan"
                    key={loan.id}
                    onClick={async () => {
                      await deleteLoan(loan.id);
                      fetchData();
                    }}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
)}


          {/* DEFAULT WELCOME MESSAGE */}
          {activeTab === null && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome to the Admin Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Please select a category (Users or Loans) from the sidebar.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashBoard;
