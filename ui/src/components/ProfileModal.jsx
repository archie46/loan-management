/**
 * ProfileModal component to display user profile data.
 * @param {object} data - The user profile data.
 * @param {function} onClose - Callback to close the modal.
 */
const ProfileModal = ({ data, onClose }) => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return (
        <div className="fixed inset-0 bg-white-500 bg-opacity-25 flex items-center justify-center z-50 p-4 font-sans animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-95 md:scale-100">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        aria-label="Close profile modal"
                        title="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="space-y-3 text-gray-700">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Username:</strong> {data.username}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Role:</strong> <span className={`font-semibold ${data.role === 'ADMIN' ? 'text-red-600' : 'text-green-600'}`}>{data.role}</span></p>
                    <p><strong>Department:</strong> {data.department}</p>
                    <p><strong>Salary:</strong>{formatter.format(data.salary)}</p>
                    <p><strong>Bank Account:</strong> {data.bankAccountNumber}</p>
                    <p><strong>Account Balance:</strong> {formatter.format(data.accountBalance)}</p>
                    <p><strong>Status:</strong> <span className={`font-semibold ${data.active ? 'text-green-500' : 'text-red-500'}`}>{data.active ? 'Active' : 'Inactive'}</span></p>
                    {/* Password is intentionally omitted for security */}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
