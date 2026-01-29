import { SignIn, SignUp } from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo1.svg";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-main)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={Logo} alt="logo" className="h-12 w-12 sm:h-14 sm:w-14" />
            <h3 className="text-2xl sm:text-3xl font-light tracking-wider">
              Obsidian Ink
            </h3>
          </div>
          <h2 className="text-xl sm:text-2xl mb-2">Editorial Access</h2>
          <p className="text-muted text-sm sm:text-base">
            Enter your credentials to access the administrative chamber
          </p>
        </div>

        {/* Clerk Sign In Component Wrapper */}
        <div className="bg-paper border border-soft p-6 sm:p-8">
          <SignUp
           signInUrl="/login"
          />
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-soft"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--bg-main)] px-4 text-muted text-sm">
              or
            </span>
          </div>
        </div>

        {/* Return Home Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-muted hover:text-[var(--accent)] text-sm transition-colors underline"
          >
            Return to the archives
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center meta text-[0.65rem] sm:text-[0.7rem] mt-6 text-muted">
          For editorial access inquiries, contact the administrator
        </p>
      </div>
    </div>
  );
};

export default Register;
