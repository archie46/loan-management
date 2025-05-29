import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FinanceSidebar from "../components/FinanceSidebar";
import { getAllLoanRequests, disburseLoan } from "../api/auth";

function FinanceDashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);


  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const fetchLoanRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllLoanRequests();
      setLoanRequests(response);
    } catch {
      setError("Failed to load loan requests.");
    } finally {
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
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentRequest(null);
  };

  const handleDisburse = async () => {
    try {
      await disburseLoan(currentRequest.id);
      closeModal();
      fetchLoanRequests();
    } catch {
      alert("Failed to disburse loan. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar
        username="Finance"
        onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
      />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && (
          <FinanceSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
        )}

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {!activeTab && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Welcome to the Finance Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Select an option from the sidebar to get started.
              </p>
            </div>
          )}

          {activeTab === "viewLoanRequests" && (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
                Finance Loan Requests
              </h1>

              {loading && (
                <p className="text-center text-gray-700">Loading loan requests...</p>
              )}

              {error && (
                <p className="text-center text-red-600 font-semibold">{error}</p>
              )}

              {!loading && !error && loanRequests.length === 0 && (
                <p className="text-center text-gray-500">No loan requests found.</p>
              )}

              {!loading && !error && loanRequests.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-md">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-blue-700 text-white">
                      <tr>
                        {[
                          "Request ID",
                          "User Name",
                          "Loan Type",
                          "Requested Amount",
                          "Status",
                          "Request Date",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-left font-semibold tracking-wide"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {loanRequests.map((req, idx) => (
                        <tr
                          key={req.id}
                          className={`${
                            idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-blue-50 transition-colors cursor-pointer`}
                          onClick={() => openModal(req)}
                          title="Click to view details"
                        >
                          <td className="px-6 py-4">{req.id}</td>
                          <td className="px-6 py-4 font-semibold">{req.userDTO.name}</td>
                          <td className="px-6 py-4">{req.loanType}</td>
                          <td className="px-6 py-4">
                            {currencyFormatter.format(req.requestedAmount)}
                          </td>
                          <td className="px-6 py-4 capitalize">{req.status.toLowerCase()}</td>
                          <td className="px-6 py-4">
                            {new Date(req.requestDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-blue-600 hover:text-blue-800">
                            <button
                              aria-label="View Loan Request Details"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(req);
                              }}
                              title="View Details"
                              className="focus:outline-none"
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
                </div>
              )}

              {/* Modal */}
              {modalOpen && currentRequest && (
                <div
                  className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50 px-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                >
                  <div className="bg-white rounded-xl max-w-lg w-full p-8 shadow-xl overflow-y-auto max-h-[90vh]">
                    <h2
                      id="modal-title"
                      className="text-2xl font-bold mb-6 text-gray-900"
                    >
                      Loan Request Details
                    </h2>

                    <div className="space-y-3 mb-6 text-gray-800">
                      <div>
                        <strong>Request ID:</strong> {currentRequest.id}
                      </div>
                      <div>
                        <strong>User:</strong> {currentRequest.userDTO.name}
                      </div>
                      <div>
                        <strong>Salary:</strong>{" "}
                        {currentRequest.userDTO.salary != null
                          ? currencyFormatter.format(currentRequest.userDTO.salary)
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Loan Type:</strong> {currentRequest.loanType}
                      </div>
                      <div>
                        <strong>Approved Amount:</strong>{" "}
                        {currencyFormatter.format(currentRequest.requestedAmount)}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">{currentRequest.status.toLowerCase()}</span>
                      </div>
                      <div>
                        <strong>Request Date:</strong>{" "}
                        {new Date(currentRequest.requestDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Remarks:</strong>{" "}
                        {currentRequest.remarks || (
                          <span className="italic text-gray-500">No remarks</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={handleDisburse}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                      >
                        Disburse
                      </button>
                      <button
                        onClick={closeModal}
                        className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default FinanceDashboard;
