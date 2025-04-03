import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Landing from "@/components/landing";
import Home from "@/components/home";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./lib/auth.tsx";

function App() {
  console.log("App rendering, VITE_TEMPO:", import.meta.env.VITE_TEMPO);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider
      clientId={clientId}
      className="from-[#1f1c1c] from-[58%] via-white bg-gradient-to-r"
    >
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/creator" element={<Home userType="writer" />} />
            <Route path="/publisher" element={<Home userType="publisher" />} />
            <Route path="/tempobook/*" element={useRoutes(routes)} />
          </Routes>
          <Toaster />
        </Suspense>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
