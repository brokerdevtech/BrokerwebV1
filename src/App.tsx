import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./Components/ProtectedRoutes";
import DashboardLayout from "./Components/Layout/layout";
import LoginPage from "./pages/Auth/Loginscreen";
import { AdminHome } from "./pages/Dashboard";
import { KycUsersList } from "./pages/kycusers";
import { BrokerList } from "./pages/BrokerList";
import AddRecommended from "./Components/AddRecommendedBroker";
import { RecommendedBrokerList } from "./pages/RecommendedBrokerList";
import UploadPodcast from "./pages/UploadPodcast";
import PodcastList from "./pages/PodcastList";
import { NonSubscriptionUserList } from "./pages/NonSubscriptionUserList";
import { SubscriptionUserList } from "./pages/Subscription";
import DashboardPostPage from "./pages/Dashboard/DashboardPostPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<KycUsersList />} />
        <Route path="/dashboard/post" element={<DashboardPostPage />} />
        <Route path="/brokerlist" element={<BrokerList />} />
        <Route path="/podcastlist" element={<PodcastList />} />
        <Route path="/recommended" element={<RecommendedBrokerList />} />
        <Route path="/upload-podcast" element={<UploadPodcast />} />
        <Route path="/non-subcription" element={<NonSubscriptionUserList />} />
        <Route path="/subcription" element={<SubscriptionUserList />} />
        {/* <Route path="/kycusers" element={<KycUsersList />} />  */}
      </Route>
    </Routes>
  );
}

export default App;
