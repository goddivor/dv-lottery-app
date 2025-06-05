// src/pages/login/index.tsx
import { useState } from "react";
import { ArrowRight, Shield, Globe, Users, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "facebook" | null
  >(null);

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setLoadingProvider(provider);

    // Simulate API call - here you'll integrate with Supabase
    setTimeout(() => {
      setIsLoading(false);
      setLoadingProvider(null);
      console.log(`Login with ${provider}`);
      // Redirect to DV Lottery application after successful login
      window.location.href = "/dv-lottery";
    }, 2000);
  };

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      text: "Secure authentication with your existing account",
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      text: "Access from anywhere, anytime",
    },
    {
      icon: <Users className="w-5 h-5 text-purple-500" />,
      text: "Family applications support",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: "Auto-save and real-time validation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Complete Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DV Lottery Application
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of applicants who trust our platform for their
              Diversity Visa Lottery applications. Secure, guided, and
              error-free.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                {benefit.icon}
                <span className="text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-blue-900">
                DV Lottery 2026 is Open!
              </span>
            </div>
            <p className="text-blue-700 text-sm">
              Registration period: October 2, 2024 - November 5, 2024. Don't
              miss your chance to apply for the American Dream.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r rounded-xl mb-6">
                <img src="/logo.svg" alt="DV Lottery" className="w-auto" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to continue your DV Lottery application
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loadingProvider === "google" ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {loadingProvider === "google"
                    ? "Signing in..."
                    : "Continue with Google"}
                </span>
                {loadingProvider !== "google" && !isLoading && (
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              <button
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-4 px-6 rounded-xl font-medium hover:bg-[#166FE5] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loadingProvider === "facebook" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {loadingProvider === "facebook"
                    ? "Signing in..."
                    : "Continue with Facebook"}
                </span>
                {loadingProvider !== "facebook" && !isLoading && (
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">
                    Secure & Private
                  </h4>
                  <p className="text-sm text-green-700">
                    We use industry-standard encryption and never store your
                    social media passwords. Your application data is saved
                    securely and accessible only to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </a>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  ⚠️ This is a practice platform. Submit your official
                  application at{" "}
                  <a
                    href="https://dvprogram.state.gov"
                    className="text-blue-600 hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dvprogram.state.gov
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Benefits */}
          <div className="lg:hidden mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  {benefit.icon}
                  <span className="text-sm text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
