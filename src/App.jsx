import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomTaskBar from "./components/BottomTaskBar";
import Header from "./components/Header";
import LatestNews from "./components/LatestNews";
import LoginRequiredModal from "./components/auth/LoginRequiredModal";
import LocationPrompt from "./components/auth/LocationPrompt";
import LoginPage from "./components/auth/LoginPage";
import NewsPostPage from "./components/NewsPostPage";
import Newsletter from "./components/Newsletter";
import NotificationPage from "./components/notifications/NotificationPage";
import ProfilePage from "./components/profile/ProfilePage";
import PublicUserProfilePage from "./components/profile/PublicUserProfilePage";
import SearchPage from "./components/SearchPage";
import UploadNewsPage from "./components/upload/UploadNewsPage";
import { setAuthToken } from "./store/apiClient";
import { fetchCurrentUser } from "./store/authSlice";
import {
  clearNotifications,
  fetchNotifications,
} from "./store/notificationSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: notifications } = useSelector((state) => state.notifications);
  const [activeView, setActiveView] = useState("home");
  const [publicProfileUserId, setPublicProfileUserId] = useState("");
  const [selectedNewsId, setSelectedNewsId] = useState("");
  const [postBackView, setPostBackView] = useState("home");
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const unreadNotificationCount = notifications.filter(
    (item) => !item.isRead,
  ).length;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const authToken = params.get("auth_token") || hashParams.get("auth_token");

    if (authToken) {
      setAuthToken(authToken);
      params.delete("auth_token");
      hashParams.delete("auth_token");
      const query = params.toString();
      const hash = hashParams.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`,
      );
    }

    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    } else {
      dispatch(clearNotifications());
    }
  }, [dispatch, user?.id]);

  function openPublicProfile(userId) {
    setPublicProfileUserId(userId);
    setActiveView("publicProfile");
  }

  function openNewsPost(newsId, backView = activeView) {
    setSelectedNewsId(newsId);
    setPostBackView(backView);
    setActiveView("post");
  }

  function openLoginPrompt() {
    setIsLoginPromptOpen(true);
  }

  function openLoginPage() {
    setIsLoginPromptOpen(false);
    setActiveView("profile");
  }

  return (
    <main className="app-shell">
      <Header
        activeView={activeView}
        onChange={setActiveView}
        unreadCount={unreadNotificationCount}
      />

      {activeView === "search" ? (
        <SearchPage onOpenProfile={openPublicProfile} />
      ) : activeView === "add" ? (
        user ? (
          <UploadNewsPage />
        ) : (
          <LoginPage />
        )
      ) : activeView === "publicProfile" ? (
        <PublicUserProfilePage
          onBack={() => setActiveView("home")}
          onLoginRequired={openLoginPrompt}
          onOpenPost={(newsId) => openNewsPost(newsId, "publicProfile")}
          userId={publicProfileUserId}
        />
      ) : activeView === "post" ? (
        <NewsPostPage
          newsId={selectedNewsId}
          onBack={() => setActiveView(postBackView)}
          onLoginRequired={openLoginPrompt}
          onOpenProfile={openPublicProfile}
        />
      ) : activeView === "profile" ? (
        user ? (
          <ProfilePage
            onOpenPost={(newsId) => openNewsPost(newsId, "profile")}
          />
        ) : (
          <LoginPage />
        )
      ) : activeView === "notification" ? (
        user ? (
          <NotificationPage
            onOpenNews={(newsId) => openNewsPost(newsId, "notification")}
            onOpenProfile={openPublicProfile}
          />
        ) : (
          <LoginPage />
        )
      ) : (
        <>
          {/* <BreakingNews /> */}
          {/* <TopicFilters /> */}

          <LatestNews onLoginRequired={openLoginPrompt} onOpenProfile={openPublicProfile} />
          {/* <Newsletter /> */}
        </>
      )}

      {user && !user.location ? <LocationPrompt /> : null}

      <BottomTaskBar
        activeView={activeView}
        onChange={setActiveView}
        unreadCount={unreadNotificationCount}
      />
      <LoginRequiredModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
        onLogin={openLoginPage}
      />
    </main>
  );
}

export default App;
