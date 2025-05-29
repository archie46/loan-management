import React from "react";

import { useNavigate } from "react-router-dom";



export default function LandingPage() {
    const navigate = useNavigate();


    return (
        <div className="bg-gradient-to-b from-white to-blue-100 min-h-screen font-sans">
            <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
                <div className="text-2xl font-bold text-blue-600">Loan Management App</div>

                <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
                        onClick={() => navigate("/login")}>

                    Login
                </button>
            </header>

            <main className="text-center py-20 px-4">
                <span className="text-sm text-gray-500 uppercase tracking-widest">Loan Management App</span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mt-4">We manage the loan process from start to finish</h1>
                <p className="text-lg text-gray-600 max-w-xl mx-auto mt-6">
                    You deliver an exceptional financing experience without any risk. Banxware handles every step of the
                    application and loan management process, plus all regulatory compliance while you earn.
                </p>
                <button className="mt-8 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-full text-lg font-semibold"
                        onClick={() => navigate("/login")}>
                    Explore Our Solution
                </button>

                <div className="relative mt-16 flex justify-center">

                    <div className="absolute top-0 left-8 bg-white p-4 rounded-xl shadow-md">
                        <p className="text-xs text-gray-400">Total Income</p>
                        <p className="text-lg font-semibold">₹654.32K</p>
                        <p className="text-green-500 text-xs">+265.08%</p>
                    </div>

                    <div className="absolute top-0 right-8 bg-white p-4 rounded-xl shadow-md">
                        <p className="text-xs text-gray-400">Total Income</p>
                        <p className="text-lg font-semibold">₹294.32K</p>
                        <p className="text-green-500 text-xs">+936.23%</p>
                    </div>
                    <div className="absolute -top-96 right-8 bg-white p-4 rounded-xl shadow-md">
                        <p className="text-xs text-gray-400">Total Income</p>
                        <p className="text-lg font-semibold">₹1623.32K</p>
                        <p className="text-green-500 text-xs">+987.23%</p>
                    </div>
                    <div className="absolute top-44 right-0 bg-white p-4 rounded-xl shadow-md">
                        <p className="text-xs text-gray-400">Total Income</p>
                        <p className="text-lg font-semibold">₹6287.32K</p>
                        <p className="text-green-500 text-xs">+936.23%</p>
                    </div>


                </div>
            </main>
        </div>

    ); }
