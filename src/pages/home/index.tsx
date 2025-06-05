// Dans votre composant HomePage existant, ajoutez :

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Votre contenu existant */}

      {/* Section DV Lottery */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🇺🇸 DV Lottery Application
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Practice filling out your Diversity Visa Lottery application with
            our step-by-step guided form. All 14 sections covered with real-time
            validation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dv-lottery"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Start New Application
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="https://dvprogram.state.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Official Site
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Auto-save enabled</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>14 steps guided</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Real-time validation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
