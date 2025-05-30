import { useState, useEffect } from "react";
import { getLoans, applyForLoan } from "../api/auth";

function LoanForm({ onClose, onSuccess }) {
  const [loanTypes, setLoanTypes] = useState([]);
  const [expandedLoanId, setExpandedLoanId] = useState(null);
  const [applyingLoanId, setApplyingLoanId] = useState(null);
  const [requestedAmount, setRequestedAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLoans()
      .then((res) => {
        setLoanTypes(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Failed to fetch loans:", err);
        setLoanTypes([]);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedLoanId(expandedLoanId === id ? null : id);
    setApplyingLoanId(null);
    setRequestedAmount("");
    setError(null);
  };

  const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  }); 

  const startApplying = (id) => {
    setApplyingLoanId(id);
    setRequestedAmount("");
    setError(null);
  };

  const handleApplySubmit = async (loanTypeObj) => {
    const username = localStorage.getItem("username");
    const amount = parseFloat(requestedAmount);

    if (!username) return setError("User not logged in.");
    if (isNaN(amount) || amount <= 0) return setError("Please enter a valid amount.");
    if (amount > loanTypeObj.maxAmount)
      return setError(`Amount cannot exceed ₹${loanTypeObj.maxAmount}`);

    try {
      setLoading(true);
      await applyForLoan({
        username,
        loanType: loanTypeObj.loanType,
        requestedAmount: amount,
      });
      setApplyingLoanId(null);
      setRequestedAmount("");
      setError(null);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError("Failed to apply for loan. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Loan Types</h2>

      <div className="space-y-5">
        {loanTypes.map((loan) => (
          <div
            key={loan.id}
            className="rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(loan.id)}
            >
              <h3 className="text-xl font-semibold text-gray-700">{loan.loanType}</h3>
              <button className="text-blue-600 hover:underline text-sm">
                {expandedLoanId === loan.id ? "Hide Details" : "View Details"}
              </button>
            </div>

            {expandedLoanId === loan.id && (
              <div className="mt-4 text-gray-600 space-y-3">
                <p>
                  <strong>Max Amount:</strong> {formatter.format(loan.maxAmount)}
                </p>
                <p>
                  <strong>Interest Rate:</strong> {loan.interestRate}%
                </p>
                <p>
                  <strong>Duration:</strong> {`${Math.floor(loan.durationMonths / 12)} year${Math.floor(loan.durationMonths / 12) !== 1 ? 's' : ''}` +
                    (loan.durationMonths % 12 ? ` and ${loan.durationMonths % 12} month${loan.durationMonths % 12 !== 1 ? 's' : ''}` : '')}
                </p>

                {applyingLoanId === loan.id ? (
                  <div className="mt-4 space-y-3">
                    <input
                      type="number"
                      min="0"
                      max={loan.maxAmount}
                      step="0.01"
                      placeholder="Enter requested amount"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      disabled={loading}
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApplySubmit(loan)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {loading ? "Applying..." : "Send Application"}
                      </button>
                      <button
                        onClick={() => {
                          setApplyingLoanId(null);
                          setRequestedAmount("");
                          setError(null);
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => startApplying(loan.id)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {onClose && (
        <div className="mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default LoanForm;
