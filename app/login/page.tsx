"use client"
import { github } from 'better-auth';
import { ArrowRight,Lock,Mail,Eye,EyeOff} from 'lucide-react'
import React, { useState } from 'react'
import { authClient } from '@/app/lib/auth-client';

export default function page() {
     const [loginEmail, setLoginEmail] = useState("");
      const [loginPassword, setLoginPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
       const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
       const handleLoginSubmit = (e: React.FormEvent) => {
           e.preventDefault();
           setIsSubmitting(true);
           setTimeout(() => {
             const nameFromEmail = loginEmail.split('@')[0]; 
             setIsSubmitting(false);
             setLoginEmail("");
             setLoginPassword("");
           }, 1200);
         };
            const githubsignin = async() => {
                setIsSubmitting(true);
                try {
                    await authClient.signIn.social({provider: "github"})
                } catch (error) {
                    console.error("GitHub sign-in error:", error);
                }}
  return (
    <div>
       <div className="flex-grow flex items-center justify-center py-10">
            <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
              <div className="text-center mb-10">
                <div className="bg-amber-500 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
                  <Lock className="text-white" size={28} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter mb-2">Välkommen <span className="text-amber-500">Tillbaka</span></h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Logga in för att hantera dina resor</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-postadress</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="namn@epost.se"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Lösenord</label>
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <input 
                      required
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-6 bg-slate-950 text-white rounded-full font-black text-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Logga In <ArrowRight /></>
                  )}
                </button>
                  <button 
                  disabled={isSubmitting}
                  onClick={githubsignin}
                  className="w-full py-6 bg-slate-950 text-white rounded-full font-black text-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Logga In <ArrowRight /></>
                  )}
                </button>
              </form>
            </div>
          </div>
    </div>
  )
}
