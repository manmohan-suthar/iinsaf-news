import "./App.css";
import { useState } from "react";
import BottomTaskBar from "./components/BottomTaskBar";
import Header from "./components/Header";
import LatestNews from "./components/LatestNews";
import Newsletter from "./components/Newsletter";
import NotificationPage from "./components/notifications/NotificationPage";
import ProfilePage from "./components/profile/ProfilePage";
import SearchPage from "./components/SearchPage";

function App() {
  const [activeView, setActiveView] = useState("home");

  return (
    <main className="app-shell">
      <Header />

      {activeView === "search" ? (
        <SearchPage />
      ) : activeView === "profile" ? (
        <ProfilePage />
      ) : activeView === "notification" ? (
        <NotificationPage />
      ) : (
        <>
          {/* <BreakingNews /> */}
          {/* <TopicFilters /> */}

          <LatestNews />
          <Newsletter />
        </>
      )}

      <BottomTaskBar activeView={activeView} onChange={setActiveView} />
    </main>
  );
}

export default App;
