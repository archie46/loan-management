import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FinanceSidebar from "../components/FinanceSidebar"; // we'll create this below
import {
  getAllLoanRequests,disburseLoan
} from "../api/auth";

function FinanceDashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  const [remarks, setRemarks] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");

  const financeId = localStorage.getItem("userId");

  const fetchLoanRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllLoanRequests();
      setLoanRequests(response);
      setLoading(false);
    } catch (err) {
      setError("Failed to load loan requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "viewLoanRequests") {
      fetchLoanRequests();
    }
  }, [activeTab]);

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

  const handleDisburse = async () => {

    const payload = {
      requestId: currentRequest.id,
      financeId: Number(financeId),
      approvedAmount: Number(approvedAmount),
    };

    try {
      await disburseLoan(currentRequest.id);
      closeModal();
      fetchLoanRequests();
    } catch (err) {
      alert("Failed to approve request. Please try again.");
    }
  };


  return (
    <div className="flex flex-col h-screen">
      <Navbar onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} username="Finance" />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && <FinanceSidebar setActiveTab={setActiveTab} activeTab={activeTab} />}

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto max-w-6xl mx-auto w-full">
          {activeTab === "viewLoanRequests" && (
            <>
              <h1 className="text-3xl font-bold mb-6 text-center">Finance Loan Requests</h1>

              {loading && <div className="text-center">Loading loan requests...</div>}
              {error && <div className="text-center text-red-600">{error}</div>}

              {!loading && !error && loanRequests.length === 0 && (
                <p className="text-center text-gray-600">No loan requests found.</p>
              )}

              {!loading && !error && loanRequests.length > 0 && (
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
                    {loanRequests.map((req, idx) => (
                      <tr
                        key={req.id}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-2">{req.id}</td>
                        <td className="px-4 py-2 font-semibold">{req.userDTO.name}</td>
                        <td className="px-4 py-2">{req.loanType}</td>
                        <td className="px-4 py-2">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(req.requestedAmount)}
                        </td>

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
                    ))}
                  </tbody>
                </table>
              )}

              {/* Modal */}
              {modalOpen && currentRequest && (
                <div className="fixed inset-0 flex items-center justify-center z-5">
                  <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg overflow-y-auto max-h-[90vh]">
                    <h2 className="text-xl font-semibold mb-4">Loan Request Details</h2>

                    <div className="mb-2"><strong>Request ID:</strong> {currentRequest.id}</div>
                    <div className="mb-2"><strong>User:</strong> {currentRequest.userDTO.name}</div>
<div className="mb-2">
  <strong>Salary:</strong>{" "}
  {currentRequest.userDTO.salary != null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(currentRequest.userDTO.salary)
    : "N/A"}
</div>
<div className="mb-2"><strong>Loan Type:</strong> {currentRequest.loanType}</div>
<div className="mb-2">
  <strong>Approved Amount:</strong>{" "}
  {new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(currentRequest.requestedAmount)}
</div>

                    <div className="mb-2"><strong>Status:</strong> {currentRequest.status}</div>
                    <div className="mb-4">
                      <strong>Request Date:</strong> {new Date(currentRequest.requestDate).toLocaleDateString()}
                    </div>


                    <div className="mb-2">
                      <strong>Remarks:</strong> {currentRequest.remarks}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleDisburse}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Disburse
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
            </>
          )}

          {activeTab === null && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome to the Finance Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Select an option from the sidebar to get started.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default FinanceDashboard;
