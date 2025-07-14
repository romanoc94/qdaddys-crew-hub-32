import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import TeamPage from "./components/TeamPage";
import ShiftsPage from "./components/ShiftsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="checklists" element={<div className="p-6"><h1 className="text-2xl font-bold">Checklists - Coming Soon</h1></div>} />
            <Route path="qcash" element={<div className="p-6"><h1 className="text-2xl font-bold">Q-Cash - Coming Soon</h1></div>} />
            <Route path="profiles" element={<div className="p-6"><h1 className="text-2xl font-bold">Profiles - Coming Soon</h1></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
