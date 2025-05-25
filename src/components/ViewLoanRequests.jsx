import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { getUserLoanRequests,cancelLoanRequest } from "../api/auth";


const ViewLoanRequests = ({ userId }) => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch loan requests on mount

  const fetchRequests = async () => {
  try {
    setLoading(true);
    const data = await getUserLoanRequests(userId);
    setLoanRequests(data);
    setError(null);
  } catch (err) {
    setError("Failed to load loan requests");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {


    fetchRequests();
  }, [userId]);

  const handleCancel = async (requestId, username) => {
    try {
      await cancelLoanRequest(requestId, username);
      fetchRequests();
    } catch (err) {
      alert("Failed to cancel loan request");
    }
  };

  if (loading) return <div>Loading loan requests...</div>;
  if (error) return <div>{error}</div>;
  if (!loanRequests.length) return <div>No loan requests found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Loan Requests</h2>
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Loan Type</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Requested Amount</th>
              <th className="border border-gray-300 p-2">Manager Remarks</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loanRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{req.id}</td>
                <td className="border border-gray-300 p-2">{req.username || "N/A"}</td>
                <td className="border border-gray-300 p-2">{req.loanType}</td>
                <td className="border border-gray-300 p-2">{req.status}</td>
                <td className="border border-gray-300 p-2">{req.requestedAmount}</td>
                <td className="border border-gray-300 p-2">{req.managerRemarks || "-"}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => {
                             handleCancel(req.id, req.username) 
                              
                            }}
                    className="text-red-600 hover:text-red-800"
                    title="Cancel Loan Request"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewLoanRequests;
