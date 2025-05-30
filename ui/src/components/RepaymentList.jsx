import React, { useEffect, useState } from "react";
import { getUserLoanRepayments, getUserLoanRequests } from "../api/auth";

const RepaymentListGrouped = ({ userId, status = "" }) => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [repaymentsGrouped, setRepaymentsGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllMap, setShowAllMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [requests, repayments] = await Promise.all([
          getUserLoanRequests(userId, status),
          getUserLoanRepayments(userId, status),
        ]);

        setLoanRequests(requests);

        const grouped = repayments.reduce((acc, repayment) => {
          const key = repayment.loanRequestId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(repayment);
          return acc;
        }, {});

        Object.keys(grouped).forEach(key => {
          grouped[key].sort(
            (a, b) => new Date(a.repaymentDate) - new Date(b.repaymentDate)
          );
        });

        setRepaymentsGrouped(grouped);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId, status]);

  const toggleShowAll = (loanRequestId) => {
    setShowAllMap((prev) => ({
      ...prev,
      [loanRequestId]: !prev[loanRequestId],
    }));
  };

  const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  }); 

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
        Loading data...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold py-20">
        Error: {error}
      </div>
    );

  const filteredLoanRequests = loanRequests.filter(
    (request) => repaymentsGrouped[request.id]?.length > 0
  );



  if (filteredLoanRequests.length === 0)
    return (
      <div className="text-center text-gray-600 py-20 font-medium">
        No loan requests with repayments found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {filteredLoanRequests.map((request) => {
        const repayments = repaymentsGrouped[request.id] || [];
        const showAll = showAllMap[request.id] || false;
        const repaymentsToShow = showAll ? repayments : repayments.slice(0, 1);

        return (
          <section
            key={request.id}
            className="mb-10 border border-gray-200 rounded-lg shadow-sm p-5"
          >
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Loan Request #{request.id}
              </h2>
              <span
                className={`px-3 py-1 rounded-full font-semibold text-sm ${
                  request.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : request.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : request.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {request.status}
              </span>
            </header>

            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold tracking-wide">
                      Repayment Date
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-semibold tracking-wide">
                      Amount
                    </th>
                    <th className="px-5 py-3 text-left text-sm font-semibold tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {repaymentsToShow.sort((a, b) => new Date(a.repaymentDate) - new Date(b.repaymentDate)).map((repay, idx) => {
                    const dateFormatted = new Date(
                      repay.repaymentDate
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    return (
                      <tr
                        key={repay.id}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-5 py-3 whitespace-nowrap text-gray-700 font-medium">
                          {dateFormatted}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-gray-600">
                          {formatter.format(repay.emiAmount.toFixed(2))}
                        </td>
                        <td
                          className={`px-5 py-3 whitespace-nowrap font-semibold ${
                            repay.status === "Paid"
                              ? "text-green-600"
                              : repay.status === "Pending"
                              ? "text-yellow-600"
                              : repay.status === "Overdue"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {repay.status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {repayments.length > 1 && (
              <button
                onClick={() => toggleShowAll(request.id)}
                className="mt-3 text-blue-600 font-medium hover:underline focus:outline-none"
                aria-label={
                  showAll ? "Show less repayments" : "Show all repayments"
                }
              >
                {showAll ? "Show Less" : "Show All"}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default RepaymentListGrouped;
