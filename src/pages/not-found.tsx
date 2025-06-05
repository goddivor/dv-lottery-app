import React, { useState, useEffect } from 'react';
import { 
  Home2, 
  ArrowLeft, 
  SearchNormal1, 
  Location, 
  DocumentText1,
  Profile2User,
  Star1,
  Heart,
  Refresh
} from 'iconsax-react';

const NotFoundPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate floating elements for background animation
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setFloatingElements(elements);
  }, []);

  const quickLinks = [
    {
      icon: <Home2 size={20} color="#3B82F6" variant="Bold" />,
      title: "Go Home",
      description: "Return to the homepage",
      href: "/",
      color: "blue"
    },
    {
      icon: <DocumentText1 size={20} color="#10B981" variant="Bold" />,
      title: "DV Lottery Form",
      description: "Continue your application",
      href: "/dv-lottery",
      color: "emerald"
    },
    {
      icon: <Profile2User size={20} color="#8B5CF6" variant="Bold" />,
      title: "Login",
      description: "Sign in to your account",
      href: "/login",
      color: "purple"
    },
    {
      icon: <SearchNormal1 size={20} color="#F59E0B" variant="Bold" />,
      title: "Search Help",
      description: "Find what you're looking for",
      href: "#",
      color: "amber"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100",
      emerald: "bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100",
      purple: "bg-purple-50 border-purple-200 hover:border-purple-300 hover:bg-purple-100",
      amber: "bg-amber-50 border-amber-200 hover:border-amber-300 hover:bg-amber-100"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animation: `float 6s ease-in-out infinite ${element.delay}s`
            }}
          >
            {element.id % 4 === 0 && <Star1 size={24} color="#3B82F6" variant="Bold" />}
            {element.id % 4 === 1 && <Heart size={20} color="#EC4899" variant="Bold" />}
            {element.id % 4 === 2 && <Location size={22} color="#10B981" variant="Bold" />}
            {element.id % 4 === 3 && <DocumentText1 size={26} color="#8B5CF6" variant="Bold" />}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* 404 Number with layered shadow effect */}
          <div className="relative mb-8">
            <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] lg:text-[20rem] font-black text-gray-100 -z-10 transform translate-x-2 translate-y-2">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              It looks like the page you're searching for has gone on its own American Dream journey. 
              Let's help you find your way back!
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${getColorClasses(link.color)}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{link.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{link.description}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Alternative Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <Refresh size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Refresh Page
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-3">
              <SearchNormal1 size={24} color="#6B7280" variant="Bold" />
              <h3 className="font-semibold text-gray-900">Still can't find what you're looking for?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              If you were trying to access a specific part of your DV Lottery application, 
              make sure you're logged in and try navigating from the homepage.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/login" className="text-blue-600 hover:text-blue-700 underline font-medium">
                Sign In
              </a>
              <span className="text-gray-400">•</span>
              <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                Contact Support
              </a>
              <span className="text-gray-400">•</span>
              <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;