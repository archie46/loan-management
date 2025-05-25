import { useState, useEffect } from "react";
import { getManagerLoanRequests, approveLoanRequest, rejectLoanRequest } from "../api/auth";
import Navbar from "../components/Navbar";

function ManagerDashboard() {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  const [remarks, setRemarks] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLoanType, setFilterLoanType] = useState("");

  const managerId = localStorage.getItem("userId");

  const fetchLoanRequests = async () => {
    try {
      setLoading(true);
      const response = await getManagerLoanRequests(managerId);
      setLoanRequests(response);
      setLoading(false);
    } catch (err) {
      setError("Failed to load loan requests.");
      setLoading(false);
    }
  };

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const openModal = (request) => {
    setCurrentRequest(request);
    setRemarks("");
    setApprovedAmount(request.requestedAmount);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentRequest(null);
    setRemarks("");
    setApprovedAmount("");
  };

  const handleApprove = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks.");
      return;
    }
    if (!approvedAmount || isNaN(approvedAmount) || approvedAmount <= 0) {
      alert("Please enter a valid approved amount.");
      return;
    }

    const payload = {
      requestId: currentRequest.id,
      managerId: Number(managerId),
      remarks,
      approvedAmount: Number(approvedAmount),
    };

    try {
      await approveLoanRequest(payload);
      closeModal();
      fetchLoanRequests();
    } catch (err) {
      alert("Failed to approve request. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks.");
      return;
    }

    const payload = {
      requestId: currentRequest.id,
      managerId: Number(managerId),
      remarks,
    };

    try {
      await rejectLoanRequest(payload);
      closeModal();
      fetchLoanRequests();
    } catch (err) {
      alert("Failed to reject request. Please try again.");
    }
  };

  // Filter loan requests based on filters
  const filteredRequests = loanRequests.filter((req) => {
    const statusMatch = filterStatus ? req.status === filterStatus : true;
    const loanTypeMatch = filterLoanType ? req.loanType === filterLoanType : true;
    return statusMatch && loanTypeMatch;
  });

  return (
    <div className="flex flex-col h-screen">
      <Navbar username="Manager" />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Manager Loan Requests</h1>

        {loading && <div className="text-center">Loading loan requests...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        {!loading && !error && loanRequests.length === 0 && (
          <p className="text-center text-gray-600">No loan requests found.</p>
        )}

        {!loading && !error && loanRequests.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-4 items-center justify-center">
              <div>
                <label htmlFor="statusFilter" className="block font-medium mb-1">Filter by Status:</label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label htmlFor="loanTypeFilter" className="block font-medium mb-1">Filter by Loan Type:</label>
                <select
                  id="loanTypeFilter"
                  value={filterLoanType}
                  onChange={(e) => setFilterLoanType(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="HOME">Home</option>
                  <option value="CAR">Car</option>
                  <option value="EDUCATION">Education</option>
                </select>
              </div>
            </div>

            <table className="min-w-full bg-white shadow rounded-lg border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Request ID</th>
                  <th className="px-4 py-3 text-left">User Name</th>
                  <th className="px-4 py-3 text-left">Loan Type</th>
                  <th className="px-4 py-3 text-left">Requested Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Request Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-600">
                      No loan requests match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req, idx) => (
                    <tr
                      key={req.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2">{req.id}</td>
                      <td className="px-4 py-2 font-semibold">{req.userDTO.name}</td>
                      <td className="px-4 py-2">{req.loanType}</td>
                      <td className="px-4 py-2">{formatter.format(req.requestedAmount)}</td>
                      <td className="px-4 py-2">{req.status}</td>
                      <td className="px-4 py-2">{new Date(req.requestDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => openModal(req)}
                          aria-label="View Loan Request Details"
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="View Details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {modalOpen && currentRequest && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-semibold mb-4">Loan Request Details</h2>

              <div className="mb-2"><strong>Request ID:</strong> {currentRequest.id}</div>
              <div className="mb-2"><strong>User:</strong> {currentRequest.userDTO.name}</div>
              <div className="mb-2"><strong>Salary:</strong> {formatter.format(currentRequest.userDTO.salary)}</div>
              <div className="mb-2"><strong>Loan Type:</strong> {currentRequest.loanType}</div>
              <div className="mb-2">
                <strong>Requested Amount:</strong> {formatter.format(currentRequest.requestedAmount)}
              </div>
              <div className="mb-2"><strong>Status:</strong> {currentRequest.status}</div>
              <div className="mb-4">
                <strong>Request Date:</strong> {new Date(currentRequest.requestDate).toLocaleDateString()}
              </div>

              <div className="mb-4">
                <label htmlFor="approvedAmount" className="block font-medium mb-1">
                  Approved Amount
                </label>
                <input
                  type="number"
                  id="approvedAmount"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="remarks" className="block font-medium mb-1">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  rows="4"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks here"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;
