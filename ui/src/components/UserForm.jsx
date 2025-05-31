import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addUser, updateUser } from "../api/auth";

function UserForm({ user, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
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
      setFormData({ ...initialFormState, ...user });
    } else {
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
      console.error("Failed to submit user form:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit User" : "Add New User"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {[
          { name: "name", label: "Full Name" },
          { name: "email", label: "Email", type: "email" },
          { name: "username", label: "Username" },
          { name: "password", label: "Password", type: "password" },
          { name: "department", label: "Department" },
          { name: "bankAccountNumber", label: "Bank Account #" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              required={!isEditMode}
              className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            required={!isEditMode}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="accountBalance" className="block text-sm font-medium text-gray-700">
            Account Balance
          </label>
          <input
            id="accountBalance"
            name="accountBalance"
            type="number"
            value={formData.accountBalance}
            onChange={handleChange}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
            <option value="FINANCE">Finance</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active User
          </label>
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
            {isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
