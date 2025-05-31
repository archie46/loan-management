import { useState, useEffect } from "react";
import { getUsers, getLoans, deleteLoan, deleteUser } from "../api/auth";
import AdminSideBar from "../components/AdminSideBar";
import Navbar from "../components/Navbar";
import { Pencil, Trash2 } from "lucide-react";
import UserForm from "../components/UserForm";
import LoanForm from "../components/LoanForm";

/**
 * Admin Dashboard main component
 */
function AdminDashBoard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  /**
   * Sort handler toggles sorting direction on column click
   * @param {string} key - Key to sort by
   */
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

/**
 * Filters and sorts a list of items based on a search term and sort configuration.
 * Supports sorting by both strings (using localeCompare) and numbers.
 *
 * @param {Array} items - The array of items to filter and sort.
 * @param {function(any): Object} keyMap - Function mapping an item to an object with sortable/searchable keys.
 * Each key in the returned object should correspond to a field in sortConfig.key.
 * @returns {Array} Filtered and sorted array of items.
 */
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

      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }

      // Convert other types to string for safe comparison
      const strA = String(valA ?? "");
      const strB = String(valB ?? "");

      return sortConfig.direction === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
};


  /**
   * Fetch users and loans data from API
   */
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

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />

      {/* Main content area with sidebar and main */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Sidebar */}
        {isSidebarVisible && <AdminSideBar setActiveTab={setActiveTab} />}

        {/* Main panel */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* USERS TAB */}
          {activeTab === "users" && (
              <section aria-label="Users Management Section">
                {isUserFormOpen ? (
                    <UserForm
                        user={editingUser}
                        onClose={() => setIsUserFormOpen(false)}
                        onSuccess={() => {
                          setIsUserFormOpen(false);
                          fetchData(); // Make sure fetchData considers the selectedRole
                        }}
                    />
                ) : (
                    <>
                      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
                        <div className="relative w-full md:w-1/2">
                          <input
                              type="text"
                              placeholder="Search users..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                              aria-label="Search users"
                          />
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 select-none pointer-events-none">
              🔍
            </span>
                        </div>

                        {/* Role Filter Dropdown - Moved here */}
                        <div className="flex items-center space-x-4"> {/* Added a div to group filter and add button */}
                          <label htmlFor="roleFilter" className="sr-only">Filter by Role</label>
                          <select
                              id="roleFilter"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                              aria-label="Filter users by role"
                          >
                            <option value="">All Roles</option>
                            {/* Assuming you have a way to get all possible roles, e.g., from your data or a predefined list */}
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="USER">User</option>
                            <option value="FINANCE">Finance</option>
                            {/* Add other roles as needed */}
                          </select>

                          <button
                              className="px-5 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                              onClick={() => {
                                setEditingUser(null); // For adding new user
                                setIsUserFormOpen(true);
                              }}
                              aria-label="Add User"
                          >
                            Add User
                          </button>
                        </div>
                      </div>

                      <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                        <thead className="bg-blue-600 text-white select-none">
                        <tr>
                          <th
                              onClick={() => handleSort("id")}
                              className="cursor-pointer px-6 py-3 text-left font-semibold hover:bg-blue-700 transition"
                              scope="col"
                              aria-sort={
                                sortConfig.key === "id"
                                    ? sortConfig.direction === "asc"
                                        ? "ascending"
                                        : "descending"
                                    : "none"
                              }
                              tabIndex={0}
                              role="button"
                          >
                            ID{" "}
                            {sortConfig.key === "id" &&
                                (sortConfig.direction === "asc" ? "▲" : "▼")}
                          </th>
                          <th
                              onClick={() => handleSort("name")}
                              className="cursor-pointer px-6 py-3 text-left font-semibold hover:bg-blue-700 transition"
                              scope="col"
                              aria-sort={
                                sortConfig.key === "name"
                                    ? sortConfig.direction === "asc"
                                        ? "ascending"
                                        : "descending"
                                    : "none"
                              }
                              tabIndex={0}
                              role="button"
                          >
                            Name{" "}
                            {sortConfig.key === "name" &&
                                (sortConfig.direction === "asc" ? "▲" : "▼")}
                          </th>
                          {/* Add Role column header */}
                          <th
                              onClick={() => handleSort("role")}
                              className="cursor-pointer px-6 py-3 text-left font-semibold hover:bg-blue-700 transition"
                              scope="col"
                              aria-sort={
                                sortConfig.key === "role"
                                    ? sortConfig.direction === "asc"
                                        ? "ascending"
                                        : "descending"
                                    : "none"
                              }
                              tabIndex={0}
                              role="button"
                          >
                            Role{" "}
                            {sortConfig.key === "role" &&
                                (sortConfig.direction === "asc" ? "▲" : "▼")}
                          </th>
                          <th className="px-6 py-3 text-left font-semibold" scope="col">
                            Actions
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Apply filter before sorting */}
                        {sortedItems(
                            users.filter(user =>
                                selectedRole === "" || user.role === selectedRole
                            ),
                            (u) => ({
                              id: u.id.toString(),
                              name: u.name,
                              role: u.role, // Include role for sorting
                            })
                        ).map((user, idx) => (
                            <tr
                                key={user.id}
                                className={`${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-blue-50 transition-colors`}
                            >
                              <td className="px-6 py-3 whitespace-nowrap">{user.id}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{user.name}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{user.role}</td> {/* Display role */}
                              <td className="px-6 py-3 flex space-x-4">
                                <button
                                    title="Edit User"
                                    onClick={() => {
                                      setEditingUser(user);
                                      setIsUserFormOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                                    aria-label={`Edit user ${user.name}`}
                                >
                                  <Pencil />
                                </button>
                                <button
                                    title="Delete User"
                                    onClick={

                                  async () => {
                                      await deleteUser(user.id);
                                      fetchData();
                                    }}
                                    className={`${
                                        user.role.includes('ADMIN') ? 'hidden' : ''
                                    } text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded`}

                                    aria-label={`Delete user ${user.name}`}
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
              </section>
          )}

          {/* LOANS TAB */}
          {activeTab === "loans" && (
            <section aria-label="Loans Management Section">
              {isLoanFormOpen ? (
                <LoanForm
                  loan={editingLoan}
                  onClose={() => setIsLoanFormOpen(false)}
                  onSuccess={() => {
                    setIsLoanFormOpen(false);
                    fetchData();
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-1/2">
                      <input
                        type="text"
                        placeholder="Search loans..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        aria-label="Search loans"
                      />
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 select-none pointer-events-none">
                        🔍
                      </span>
                    </div>
                    <button
                      className="px-5 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      onClick={() => {
                        setEditingLoan(null);
                        setIsLoanFormOpen(true);
                      }}
                      aria-label="Add Loan"
                    >
                      Add Loan
                    </button>
                  </div>

                  <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                    <thead className="bg-blue-600 text-white select-none">
                      <tr>
                        <th
                          onClick={() => handleSort("id")}
                          className="cursor-pointer px-6 py-3 text-left font-semibold hover:bg-blue-700 transition"
                          scope="col"
                          aria-sort={
                            sortConfig.key === "id"
                              ? sortConfig.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                          tabIndex={0}
                          role="button"
                        >
                          ID{" "}
                          {sortConfig.key === "id" &&
                            (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                          onClick={() => handleSort("loanType")}
                          className="cursor-pointer px-6 py-3 text-left font-semibold hover:bg-blue-700 transition"
                          scope="col"
                          aria-sort={
                            sortConfig.key === "loanType"
                              ? sortConfig.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                          tabIndex={0}
                          role="button"
                        >
                          Loan Type{" "}
                          {sortConfig.key === "loanType" &&
                            (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                          onClick={() => handleSort("maxAmount")}
                          className="cursor-pointer px-6 py-3 text-left font-semibold hover:bg-blue-700 transition"
                          scope="col"
                          aria-sort={
                            sortConfig.key === "maxAmount"
                              ? sortConfig.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                          tabIndex={0}
                          role="button"
                        >
                          Max Amount{" "}
                          {sortConfig.key === "maxAmount" &&
                            (sortConfig.direction === "asc" ? "▲" : "▼")}
                        </th>
                        <th className="px-6 py-3 text-left font-semibold" scope="col">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedItems(loans, (loan) => ({
                        id: loan.id.toString(),
                        loanType: loan.loanType || "",
                        maxAmount: loan.maxAmount || "",
                      })).map((loan, idx) => (
                        <tr
                          key={loan.id}
                          className={`${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-6 py-3 whitespace-nowrap">{loan.id}</td>
                          <td className="px-6 py-3 whitespace-nowrap">{loan.loanType}</td>
                          <td className="px-6 py-3 whitespace-nowrap">{formatter.format(loan.maxAmount)}</td>
                          <td className="px-6 py-3 flex space-x-4">
                            <button
                              title="Edit Loan"
                              onClick={() => {
                                setEditingLoan(loan);
                                setIsLoanFormOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                              aria-label={`Edit loan for ${loan.loanType}`}
                            >
                              <Pencil />
                            </button>
                            <button
                              title="Delete Loan"
                              onClick={async () => {
                                await deleteLoan(loan.id);
                                fetchData();
                              }}
                              className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                              aria-label={`Delete loan for ${loan.loanType}`}
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
            </section>
          )}

          {/* Placeholder if no tab selected */}
          {!activeTab && (
            <div className="text-center text-gray-500 mt-20 select-none">
              Please select a tab from the sidebar.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashBoard;
