import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addUser, updateUser} from "../api/auth";

function UserForm({ user, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams(); // may be undefined
  const isEditMode = Boolean(paramUserId || user?.id);
  const userId = paramUserId || user?.id;

  const initialFormState = {
    name: "",
    email: "",
    role: "USER",
    username: "",
    password: "",
    salary: "",
    bankAccountNumber: "",
    accountBalance: "",
    department: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (user) {
      // Use passed user prop
      setFormData({ ...initialFormState, ...user });
    } else {
      // Ensure form is reset on "Add" mode
      setFormData(initialFormState);
    }
  }, [user, userId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateUser(userId, formData);
      } else {
        await addUser(formData);
      }

      if (onSuccess) onSuccess();
      else navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit User" : "Add User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "username", "password", "department", "bankAccountNumber"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
            className="w-full p-2 border rounded"
            required={!isEditMode}

          />
        ))}
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
          required={!isEditMode}

        />
        <input
          type="number"
          name="accountBalance"
          value={formData.accountBalance}
          onChange={handleChange}
          placeholder="Account Balance"
          className="w-full p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={!isEditMode}

        >
          <option value="USER">USER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2"
          />
          Active
        </label>
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

export default UserForm;
