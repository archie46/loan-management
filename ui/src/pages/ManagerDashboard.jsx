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

  const filteredRequests = loanRequests.filter((req) => {
    const statusMatch = filterStatus ? req.status === filterStatus : true;
    const loanTypeMatch = filterLoanType ? req.loanType === filterLoanType : true;
    return statusMatch && loanTypeMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar username="Manager" />
      <main className="flex-grow max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Manager Loan Requests
        </h1>

        {loading && (
          <div className="text-center text-gray-600 animate-pulse">
            Loading loan requests...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-semibold">
            {error}
          </div>
        )}

        {!loading && !error && loanRequests.length === 0 && (
          <p className="text-center text-gray-600 text-lg mt-12">
            No loan requests found.
          </p>
        )}

        {!loading && !error && loanRequests.length > 0 && (
          <>
            <section className="flex flex-wrap justify-center gap-6 mb-8">
              <div>
                <label
                  htmlFor="statusFilter"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Filter by Status
                </label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="loanTypeFilter"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Filter by Loan Type
                </label>
                <select
                  id="loanTypeFilter"
                  value={filterLoanType}
                  onChange={(e) => setFilterLoanType(e.target.value)}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="HOME">Home</option>
                  <option value="CAR">Car</option>
                  <option value="EDUCATION">Education</option>
                </select>
              </div>
            </section>

            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
              <table className="min-w-full border-collapse table-fixed">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">Request ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">User Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">Loan Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">Requested Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">Request Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-gray-500 italic">
                        No loan requests match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => (
                      <tr
                        key={req.id}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-4 font-mono text-sm text-gray-700">{req.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{req.userDTO.name}</td>
                        <td className="px-6 py-4 capitalize text-gray-800">{req.loanType.toLowerCase()}</td>
                        <td className="px-6 py-4 font-mono text-gray-700">{formatter.format(req.requestedAmount)}</td>
                        <td className={`px-6 py-4 font-semibold ${req.status === 'APPROVED' ? 'text-green-600' : req.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {req.status}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(req.requestDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openModal(req)}
                            aria-label="View Loan Request Details"
                            title="View Details"
                            className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
            </div>
          </>
        )}

        {modalOpen && currentRequest && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-lg max-w-lg w-full p-8 shadow-xl overflow-y-auto max-h-[90vh] animate-fadeIn">
              <h2
                id="modal-title"
                className="text-2xl font-bold mb-6 text-gray-900"
              >
                Loan Request Details
              </h2>

              <div className="space-y-3 mb-6 text-gray-800">
                <p><strong>Request ID:</strong> {currentRequest.id}</p>
                <p><strong>User:</strong> {currentRequest.userDTO.name}</p>
                <p><strong>Salary:</strong> {formatter.format(currentRequest.userDTO.salary)}</p>
                <p><strong>Loan Type:</strong> {currentRequest.loanType}</p>
                <p><strong>Requested Amount:</strong> {formatter.format(currentRequest.requestedAmount)}</p>
                <p><strong>Status:</strong> {currentRequest.status}</p>
                <p><strong>Request Date:</strong> {new Date(currentRequest.requestDate).toLocaleDateString()}</p>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="approvedAmount"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Approved Amount
                </label>
                <input
                  type="number"
                  id="approvedAmount"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  min="0"
                  aria-describedby="approvedAmountHelp"
                />
                <small
                  id="approvedAmountHelp"
                  className="text-gray-500 text-sm"
                >
                  Enter the approved loan amount
                </small>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="remarks"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks here"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="px-5 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  Reject
                </button>
                <button
                  onClick={closeModal}
                  className="px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
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
