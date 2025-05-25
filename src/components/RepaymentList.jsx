import React, { useEffect, useState } from "react";
import { getUserLoanRepayments, getUserLoanRequests } from "../api/auth"; // adjust path

const RepaymentListGrouped = ({ userId, status = "" }) => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [repaymentsGrouped, setRepaymentsGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllMap, setShowAllMap] = useState({}); // tracks which loanRequests show all repayments

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [requests, repayments] = await Promise.all([
          getUserLoanRequests(userId, status),
          getUserLoanRepayments(userId, status),
        ]);

        setLoanRequests(requests);

        // Group repayments by loanRequestId
        const grouped = repayments.reduce((acc, repayment) => {
          const key = repayment.loanRequestId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(repayment);
          return acc;
        }, {});

        // Sort each repayment array by repaymentDate descending
        Object.keys(grouped).forEach(key => {
          grouped[key].sort((a, b) => new Date(b.repaymentDate) - new Date(a.repaymentDate));
        });

        setRepaymentsGrouped(grouped);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, status]);

  const toggleShowAll = (loanRequestId) => {
    setShowAllMap(prev => ({
      ...prev,
      [loanRequestId]: !prev[loanRequestId],
    }));
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Filter loanRequests to only those with repayments
  const filteredLoanRequests = loanRequests.filter(
    (request) => repaymentsGrouped[request.id]?.length > 0
  );

  if (filteredLoanRequests.length === 0) return <p>No loan requests with repayments found.</p>;

  return (
    <div>
      {filteredLoanRequests.map((request) => {
        const repayments = repaymentsGrouped[request.id] || [];
        const showAll = showAllMap[request.id] || false;

        // If not showing all, only show the latest repayment (repayments already sorted desc)
        const repaymentsToShow = showAll ? repayments : repayments.slice(0, 1);

        return (
          <div key={request.id} className="mb-8">
            <h2 className="text-xl font-bold mb-2">
              Loan Request #{request.id} - Status: {request.status}
            </h2>

            <table className="min-w-full bg-white shadow rounded-lg border-collapse mb-4">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Repayment Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {repaymentsToShow.map((repay, idx) => {
                  const dateFormatted = new Date(repay.repaymentDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={repay.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2">{dateFormatted}</td>
                      <td className="px-4 py-2">${repay.emiAmount.toFixed(2)}</td>
                      <td className="px-4 py-2">{repay.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {repayments.length > 1 && (
              <button
                onClick={() => toggleShowAll(request.id)}
                className="text-blue-600 hover:underline"
              >
                {showAll ? "Show Less" : "Show All"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RepaymentListGrouped;
