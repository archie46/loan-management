import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addLoan, updateLoan, getUsers } from "../api/auth";

function LoanForm({ loan, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { loanId: paramLoanId } = useParams();
  const isEditMode = Boolean(paramLoanId || loan?.id);
  const loanId = paramLoanId || loan?.id;

  const initialFormState = {
    loanType: "",
    maxAmount: "",
    interestRate: "",
    approverManager: null,
    durationMonths: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    getUsers().then((res) => {
      setManagers(res.filter((user) => user.role.includes("MANAGER")));
    });

    if (loan) {
      setFormData({ ...initialFormState, ...loan });
    } else {
      setFormData(initialFormState);
    }
  }, [loan, loanId, isEditMode]);

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name === "approverManager"
        ? value
          ? managers.find((m) => String(m.id) === value) || null
          : null
        : value,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const payload = {
      ...formData,
    approverManager: formData.approverManager || null,
    };
      console.log("Submitting payload:", payload);


      if (isEditMode) {
        await updateLoan(loanId, payload);
      } else {
        await addLoan(payload);
      }

      if (onSuccess) onSuccess();
      else navigate("/admin");
    } catch (err) {
      console.error("Error submitting loan form:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Loan" : "Create Loan"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        <div>
          <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
            Loan Type
          </label>
          <input
            id="loanType"
            name="loanType"
            type="text"
            value={formData.loanType}
            onChange={handleChange}
            required={!isEditMode}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">
            Max Amount
          </label>
          <input
            id="maxAmount"
            name="maxAmount"
            type="number"
            value={formData.maxAmount}
            onChange={handleChange}
            required={!isEditMode}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            id="interestRate"
            name="interestRate"
            type="number"
            value={formData.interestRate}
            onChange={handleChange}
            required={!isEditMode}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700">
            Duration (Months)
          </label>
          <input
            id="durationMonths"
            name="durationMonths"
            type="number"
            value={formData.durationMonths}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="approverManager" className="block text-sm font-medium text-gray-700">
            Approving Manager
          </label>
          <select
            id="approverManager"
            name="approverManager"
            value={formData.approverManager ? formData.approverManager.id : ""}
            onChange={handleChange}
            required={!isEditMode}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select Manager
            </option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.username})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isEditMode ? "Update Loan" : "Create Loan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoanForm;
