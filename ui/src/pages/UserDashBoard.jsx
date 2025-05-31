import { useState } from "react";
import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";
import ApplyLoanForm from "../components/ApplyLoanForm";
import RepaymentList from "../components/RepaymentList";
import ViewLoanRequests from "../components/ViewLoanRequests";
import {toast} from "react-toastify";

function UserDashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const userId = localStorage.getItem("userId");



  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />

      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && (
          <UserSidebar setActiveTab={setActiveTab} />
        )}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "applyLoan" && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Apply for a Loan</h2>
              <ApplyLoanForm onSuccess={() => toast.success("Loan Applied Successfully!")} onClose={() => setActiveTab(null)}/>
            </section>
          )}

          {activeTab === "repayments" && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Repayments</h2>
              <RepaymentList userId={userId} />
            </section>
          )}

          {activeTab === "viewLoanRequests" && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Loan Requests</h2>
              <ViewLoanRequests userId={userId} />
            </section>
          )}

          {!activeTab && (
            <div className="text-center py-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your Dashboard
              </h2>
              <p className="text-gray-600 text-lg">
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
