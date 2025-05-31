import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, LogOut, Settings } from 'lucide-react'; // Added Settings for My Profile icon
import { getMyProfile } from "../api/auth.jsx";
import ProfileModal from "./ProfileModal.jsx";
import {useNavigate} from "react-router-dom";



/**
 * Navbar component for the top header bar.
 * @param {function} onToggleSidebar - Callback to toggle sidebar visibility.
 */
const Navbar = ({ onToggleSidebar }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();


    // Effect to close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setProfileData(data);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            }
        };
        fetchProfile();
    }, []);

    const displayName = profileData?.name || "Guest";



    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleMyProfileClick = async () => {
        setShowDropdown(false); // Close dropdown immediately
        try {
            setShowProfileModal(true);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
            // Optionally show an error message to the user
        }
    };



    return (
        <header className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-between px-6 py-3 shadow-md font-sans">
            {/* Left: Sidebar toggle button and title */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleSidebar}
                    className="text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1 transition-all duration-200 ease-in-out"
                    aria-label="Toggle sidebar"
                    title="Toggle sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl md:text-2xl font-semibold tracking-wide select-none">Dashboard</h1>
            </div>

            {/* Right: User info and dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-sm md:text-base hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1 transition-all duration-200 ease-in-out"
                    aria-haspopup="true"
                    aria-expanded={showDropdown}
                    aria-label="User menu"
                    title="User menu"
                >
                    <User className="w-5 h-5 text-white" aria-hidden="true" />
                    <span className="font-medium select-none">{displayName}</span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
                        <button
                            onClick={handleMyProfileClick}
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-100 w-full text-left transition-colors duration-200 ease-in-out rounded-md"
                            role="menuitem"
                        >
                            <Settings className="w-4 h-4 mr-2 text-gray-600" />
                            My Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-100 w-full text-left transition-colors duration-200 ease-in-out rounded-md"
                            role="menuitem"
                        >
                            <LogOut className="w-4 h-4 mr-2 text-gray-600" />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {showProfileModal && profileData && (
                <ProfileModal data={profileData} onClose={() => setShowProfileModal(false)} />
            )}
        </header>
    );
};


export default Navbar;
