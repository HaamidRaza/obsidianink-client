import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo1.svg";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--bg-main)]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={Logo} alt="logo" className="h-10 w-10 sm:h-12 sm:w-12" />
            <h3 className="text-xl sm:text-2xl font-light tracking-wider">
              Obsidian Ink
            </h3>
          </div>
          <h2 className="text-lg sm:text-xl mb-2">Join Our Community</h2>
          <p className="text-muted text-xs sm:text-sm px-4">
            Create your account to start sharing your stories
          </p>
        </div>

        {/* Clerk Sign Up Component Wrapper */}
        <div className="flex items-center justify-center md:bg-paper md:border border-soft p-4 md:p-6 rounded-lg">
          <SignUp
            routing="path"
            path="/register"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 bg-transparent",
                headerTitle: "text-base sm:text-lg",
                headerSubtitle: "text-xs sm:text-sm",
                socialButtonsBlockButton: "text-sm py-2",
                formFieldInput: "text-sm py-2",
                formButtonPrimary: "text-sm py-2.5",
                footer: "hidden",
                identityPreviewText: "text-sm",
                formFieldLabel: "text-sm",
              },
            }}
          />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-soft"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--bg-main)] px-4 text-muted text-xs sm:text-sm">
              or
            </span>
          </div>
        </div>

        {/* Return Home Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-muted hover:text-[var(--accent)] text-xs sm:text-sm transition-colors underline cursor-pointer"
          >
            Return to the archives
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center meta text-[0.6rem] sm:text-[0.65rem] mt-4 text-muted px-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[var(--accent)] hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;