import Link from "next/link";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="text-center max-w-md">

                {/* Book Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                    </div>
                </div>

                {/* Error Code */}
                <h1 className="text-8xl font-bold text-gray-900 tracking-tight">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                    Oops! Page Not Found
                </h2>

                <p className="text-gray-500 mt-3 leading-relaxed">
                    Looks like this page is missing from our bookshelf.
                    Let's get you back to discovering your next favorite book.
                </p>

                {/* Back Home Button */}
                <Link
                    href="/"
                    className="inline-block mt-8 px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition duration-300"
                >
                    Back to Home
                </Link>

                <p className="text-sm text-gray-400 mt-8">
                    © 2026 Book Nook. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
