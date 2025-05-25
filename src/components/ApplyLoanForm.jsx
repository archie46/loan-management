import { useState, useEffect } from "react";
import { getLoans, applyForLoan } from "../api/auth";

function LoanForm({ onClose, onSuccess }) {
  const [loanTypes, setLoanTypes] = useState([]);
  const [expandedLoanId, setExpandedLoanId] = useState(null);
  const [applyingLoanId, setApplyingLoanId] = useState(null); // track which loan we are applying for
  const [requestedAmount, setRequestedAmount] = useState(""); // input for requested amount
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLoans()
      .then((res) => {
        console.log("Loans response:", res);
        setLoanTypes(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Failed to fetch loans:", err);
        setLoanTypes([]);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedLoanId(expandedLoanId === id ? null : id);
    // reset applying state if user collapses or switches loan
    setApplyingLoanId(null);
    setRequestedAmount("");
    setError(null);
  };

  const startApplying = (id) => {
    setApplyingLoanId(id);
    setRequestedAmount("");
    setError(null);
  };

  const handleApplySubmit = async (loanTypeObj) => {
    const username = localStorage.getItem("username");
    const amount = parseFloat(requestedAmount);

    if (!username) {
      setError("User not logged in.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amount > loanTypeObj.maxAmount) {
      setError(`Requested amount cannot exceed max amount: $${loanTypeObj.maxAmount}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await applyForLoan({
        username,
        loanType: loanTypeObj.loanType,
        requestedAmount: amount,
      });
      setLoading(false);
      setApplyingLoanId(null);
      setRequestedAmount("");
      if (onSuccess) onSuccess();
    } catch (e) {
      setLoading(false);
      setError("Failed to apply for loan. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Available Loan Types</h2>
      <div className="space-y-4">
        {loanTypes.map((loanType) => (
          <div
            key={loanType.id}
            className="border rounded p-4 shadow hover:shadow-lg transition duration-200"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(loanType.id)}
            >
              <h3 className="text-xl font-semibold">{loanType.loanType}</h3>
              <button className="text-blue-600 underline">
                {expandedLoanId === loanType.id ? "Hide" : "View Details"}
              </button>
            </div>

            {expandedLoanId === loanType.id && (
              <div className="mt-4 space-y-2">
                <p><strong>Max Amount:</strong> formatter.format({loanType.maxAmount})</p>
                <p><strong>Interest Rate:</strong> {loanType.interestRate}%</p>
                <p><strong>Duration:</strong> {loanType.durationMonths} months</p>

                {applyingLoanId === loanType.id ? (
                  <>
                    <input
                      type="number"
                      min="0"
                      max={loanType.maxAmount}
                      step="0.01"
                      placeholder="Enter amount"
                      className="border p-2 rounded w-full mt-2"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      disabled={loading}
                    />
                    {error && <p className="text-red-600 mt-1">{error}</p>}
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleApplySubmit(loanType)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? "Applying..." : "Send"}
                      </button>
                      <button
                        onClick={() => {
                          setApplyingLoanId(null);
                          setRequestedAmount("");
                          setError(null);
                        }}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => startApplying(loanType.id)}
                  >
                    Apply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {onClose && (
        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default LoanForm;
