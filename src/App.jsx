import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Training from "./pages/Training";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Members":
        return <Members />;

      case "Training":
        return <Training />;

      case "Events":
        return <Events />;

      case "Announcements":
        return <Announcements />;

      case "Settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="p-5 md:p-8">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default App;