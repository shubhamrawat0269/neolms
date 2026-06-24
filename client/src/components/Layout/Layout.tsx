import React from "react";
import Navbar from "../Navigation/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 VeoLMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
