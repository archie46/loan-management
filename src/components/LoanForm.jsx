import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addLoan, updateLoan, getUsers } from "../api/auth";

function LoanForm({ loan ,onClose, onSuccess }) {
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
    // Fetch managers on mount
    getUsers().then((res) =>{
      console.log(res);
      setManagers(res.filter((user) => user.role.includes("MANAGER")))
    }
      
    );
    

    if (loan) {
      // Load loan details when editing

        setFormData({ ...initialFormState, ...loan });
    } else {
      // Reset form in add mode
      setFormData(initialFormState);
    }
  }, [loan,loanId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "approverManager" ? (value ? parseInt(value) : null) : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...formData,      
      approverManager: formData.approverManager
        ? { id: formData.approverManager }
        : null,
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2)); // DEBUG: logs payload as pretty JSON

    if (isEditMode) {
      await updateLoan(loanId, payload);
    } else {
      await addLoan(payload);
    }

    if (onSuccess) onSuccess();
    else navigate("/admin");
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? "Edit Loan" : "Add Loan"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
          placeholder="Loan Type"
          className="w-full p-2 border rounded"
          required={!isEditMode}
        />
        <input
          type="number"
          name="maxAmount"
          value={formData.maxAmount}
          onChange={handleChange}
          placeholder="Max Amount"
          className="w-full p-2 border rounded"
          required={!isEditMode}
        />
        <input
          type="number"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleChange}
          placeholder="Interest Rate"
          className="w-full p-2 border rounded"
          required={!isEditMode}
        />
        <input
          type="number"
          name="durationMonths"
          value={formData.durationMonths}
          onChange={handleChange}
          placeholder="Duration (Months)"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="approverManager"
          value={formData.approverManager ?? ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={!isEditMode}
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
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoanForm;
