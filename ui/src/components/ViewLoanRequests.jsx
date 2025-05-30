import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { getUserLoanRequests, cancelLoanRequest } from "../api/auth";

const ViewLoanRequests = ({ userId }) => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getUserLoanRequests(userId);
      setLoanRequests(data);
      setError(null);
    } catch {
      setError("Failed to load loan requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  }); 

  const handleCancel = async (requestId, username) => {
    if (!window.confirm("Are you sure you want to cancel this loan request?")) return;
    try {
      setCancellingId(requestId);
      await cancelLoanRequest(requestId, username);
      fetchRequests();
    } catch {
      alert("Failed to cancel loan request");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading loan requests...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold py-20">
        {error}
      </div>
    );

  if (!loanRequests.length)
    return (
      <div className="text-center text-gray-600 py-20">
        No loan requests found.
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Requests</h2>
      <div className="overflow-x-auto max-h-[450px] rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              {[
                "ID",
                "Loan Type",
                "Status",
                "Requested Amount",
                "Manager Remarks",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loanRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">{req.id}</td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-600">{req.loanType}</td>
                <td className={`px-4 py-3 whitespace-nowrap font-semibold ${
                  req.status === "APPROVED" ? "text-green-600" :
                  req.status === "PENDING" ? "text-yellow-600" :
                  req.status === "REJECTED" ? "text-red-600" : 
                      req.status === "DISBURSED" ? "text-orange-600" :"text-gray-600"
                }`}>
                  {req.status}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatter.format(req.requestedAmount)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500 italic">{req.managerRemarks || "-"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleCancel(req.id, req.username)}
                    className={`inline-flex items-center justify-center text-red-600 hover:text-red-800 transition ${
                      cancellingId === req.id ? "cursor-wait" : "cursor-pointer"
                    }`}
                    title="Cancel Loan Request"
                    disabled={cancellingId === req.id}
                  >
                    <XCircle className="w-6 h-6" />
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
