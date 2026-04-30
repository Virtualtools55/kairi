"use client";

import AdminMenuBar from "./Components/adminMenuBar/adminMenuBar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // इन पेजों पर साइडबार और फ्लेक्स लेआउट नहीं चाहिए
  const authRoutes = ["/admin/login", "/admin/signup"];
  const isAuthPage = authRoutes.includes(pathname);

  return (
    <div className={isAuthPage ? "min-h-screen bg-gray-50" : "flex min-h-screen bg-[#FFFBF2]"}>
      
      {/* अगर लॉगिन या साइनअप पेज नहीं है, तभी साइडबार दिखाओ */}
      {!isAuthPage && <AdminMenuBar />}

      <main className={`flex-1 ${!isAuthPage ? "overflow-y-auto max-h-screen" : "flex items-center justify-center"}`}>
        {children}
      </main>
      
    </div>
  );
}