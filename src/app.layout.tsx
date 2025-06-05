import { Outlet } from "react-router";

export default function RootLayout() {
  return <Outlet />;
}

// export default function RootLayout() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <img src="/logo.svg" alt="DV Lottery" className="h-8 w-auto" />
//               <h1 className="text-xl font-bold text-gray-900">
//                 DV Lottery Application
//               </h1>
//             </div>

//             <nav className="flex items-center space-x-6">
//               <a
//                 href="/"
//                 className="text-gray-600 hover:text-gray-900 transition-colors"
//               >
//                 Home
//               </a>
//               <a
//                 href="/dv-lottery"
//                 className="bg-primary-500 text-gray-600 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//               >
//                 Start Application
//               </a>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main content */}
//       <main className="flex-1">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-auto">
//         <div className="container mx-auto px-4 py-6">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">
//               ⚠️ This is a practice application form. Submit your actual
//               application at{" "}
//               <a
//                 href="https://dvprogram.state.gov"
//                 className="text-primary-600 hover:text-primary-700 underline"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 dvprogram.state.gov
//               </a>
//             </p>
//             <p className="text-xs text-gray-500">
//               © 2024 DV Lottery Practice Form • Data is saved locally in your
//               browser
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
