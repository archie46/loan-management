import { useState } from "react";
import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";
import ApplyLoanForm from "../components/ApplyLoanForm";
import RepaymentList from "../components/RepaymentList";
import ViewLoanRequests from "../components/ViewLoanRequests"; // Import the new component

function UserDashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  // Replace this with your actual user ID logic, e.g. from auth context or props
  const userId = localStorage.getItem("userId");

  return (
    <div className="flex flex-col h-screen">
      <Navbar onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && <UserSidebar setActiveTab={setActiveTab} />}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {activeTab === "applyLoan" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Apply for a Loan</h2>
              <ApplyLoanForm />
            </div>
          )}

          {activeTab === "repayments" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Repayments</h2>
              <RepaymentList userId={userId} />
            </div>
          )}

          {activeTab === "viewLoanRequests" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">View Loan Requests</h2>
              <ViewLoanRequests userId={userId} />
            </div>
          )}

          {activeTab === null && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome to Your Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Select an option from the sidebar to get started.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
