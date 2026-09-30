import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Zap, Globe, Shield, ArrowRight, MessageSquareText, X } from 'lucide-react';

export default function Home() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const features = [
        { icon: <Zap size={22} />, title: 'Lightning Fast', desc: 'Runs entirely in your browser. No loading screens, no server delays.' },
        { icon: <Globe size={22} />, title: 'Global Currencies', desc: 'Support for USD, EUR, GBP, INR, and more with exact formatting.' },
        { icon: <Shield size={22} />, title: 'Tax Compliant', desc: 'Built-in support for global tax structures including India GST.' },
        { icon: <FileText size={22} />, title: 'Vector PDFs', desc: 'Export crystal-clear, print-ready documents that look perfect on any device.' },
    ];

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const message = formData.get('message');
        const subject = encodeURIComponent("InvoiceMint Feedback");

        // Format body for Gmail
        const body = encodeURIComponent(`From: ${email}\n\nMessage:\n${message}\n\n---\nSent directly via InvoiceMint App`);

        // Direct Gmail Web Compose URL (Bypasses CORS, API limits, and Local OS Mail Clients)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=marketing.ktp85@gmail.com&su=${subject}&body=${body}`;

        window.open(gmailUrl, '_blank');
        setIsFeedbackOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white flex flex-col relative">
            <Helmet>
                <title>InvoiceMint — Professional Invoice Generator</title>
                <meta name="description" content="Generate professional invoices, receipts, and bills instantly. Secure, offline, and beautifully designed." />
                <link rel="canonical" href="https://invoicemint.com/" />
                <meta name="robots" content="index, follow" />
            </Helmet>

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-5">
                <div className="flex items-center gap-3">
                    <img src="/favicon.svg" alt="InvoiceMint Logo" className="w-10 h-10 drop-shadow-md" />
                    <span className="font-bold text-xl tracking-tight">InvoiceMint</span>
                </div>
                <Link
                    to="/workspace"
                    className="text-sm font-semibold text-blue-300 hover:text-white transition-colors"
                >
                    Open Editor →
                </Link>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative mt-8 md:mt-0">
                {/* Glow effect */}
                <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -top-20 pointer-events-none" />

                <div className="relative z-10 max-w-3xl space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold text-blue-200 border border-white/10 tracking-wide uppercase">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        100% Free • Secure • Local
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                        Create <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Professional Invoices</span> Instantly.
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Generate beautifully crafted tax invoices, bills, and rent receipts. Export flawless vector PDFs securely without an account.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 pb-12 md:pb-0">
                        <Link
                            to="/workspace"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_30px_rgba(37,99,235,0.6)] hover:-translate-y-1"
                        >
                            Create Invoice <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Features */}
            <section className="px-6 md:px-12 py-16 mt-auto">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/10 transition-all group">
                            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/40 group-hover:scale-110 transition-all duration-300">
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-sm mb-2 text-slate-200 group-hover:text-white transition-colors">{f.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-10 mt-auto border-t border-white/5 relative z-10 bg-slate-900/50 backdrop-blur">
                <p className="text-sm font-semibold text-slate-400">© {new Date().getFullYear()} InvoiceMint. All rights reserved.</p>
                <p className="text-xs text-slate-500 mt-2 tracking-wide uppercase">Private, secure, and entirely client-side</p>
            </footer>

            {/* Floating Feedback Button */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-900/50 transition-all hover:-translate-y-1 z-40 flex items-center gap-2 font-semibold text-sm group"
            >
                <MessageSquareText size={20} />
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-all duration-300 ease-in-out">
                    Feedback / Help
                </span>
            </button>

            {/* Feedback Modal Overlay */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquareText size={20} className="text-blue-400" />
                                Help & Feedback
                            </h3>
                            <button
                                onClick={() => setIsFeedbackOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 bg-slate-800/50">
                            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-left">
                                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                    Have a suggestion, found a bug, or need help? Send us a message directly!
                                </p>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-600 font-sans text-white focus:bg-slate-950"
                                        placeholder="hello@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors h-32 resize-none placeholder:text-slate-600 font-sans text-white focus:bg-slate-950"
                                        placeholder="Type your feedback here..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 py-3.5 rounded-lg transition-colors mt-4 shadow-lg shadow-blue-900/30 font-sans"
                                >
                                    Open Gmail to Send
                                </button>
                                <p className="text-[10px] text-center text-slate-500 mt-3 uppercase tracking-wider font-semibold">
                                    Direct Compose Link (No Account Needed)
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
