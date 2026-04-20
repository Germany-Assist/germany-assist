import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ServiceProfile from "./features/service/serviceProfile/ServiceProfile.jsx";
import AuthPortal from "./features/auth/AuthPortal.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import SPNotifications from "./features/Dashboard/tabs/serviceProvider/SPNotifications.jsx";
import DashboardMap from "./features/Dashboard/tabs/index.js";
import { useProfile } from "./contexts/ProfileContext.jsx";
import ServiceProfileAdmin from "./features/service/serviceProfile/ServiceProfileAdmin.jsx";
import ServiceViewProvider from "./features/service/serviceProfile/ServiceViewProvider.jsx";
import ProviderTimeline from "./pages/ProviderTimelinePage.jsx";
function App() {
  const { profile } = useProfile();
  const role = profile?.role;

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/auth" element={<AuthPortal />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/service/:serviceId" element={<ServiceProfile />} />
        <Route path="/admin/service/:id" element={<ServiceProfileAdmin />} />
        <Route path="/provider/service/:id" element={<ServiceViewProvider />} />
        <Route path="/timeline/:timelineId" element={<TimelinePage />} />
        <Route path="/provider/timeline/:id" element={<ProviderTimeline />} />

        {/*  Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardPage />}>
          {role &&
            DashboardMap[role] &&
            Object.values(DashboardMap[role]).flatMap((item) => {
              const routes = [];

              const Component = item.component;
              routes.push(
                <Route
                  key={item.label}
                  path={item.path === "" ? undefined : item.path}
                  index={item.path === ""}
                  element={<Component />}
                />,
              );

              if (item.children) {
                item.children.forEach((child) => {
                  const ChildComponent = child.component;
                  routes.push(
                    <Route
                      key={`${item.label}-${child.label}`}
                      path={`${item.path}/${child.path}`}
                      element={<ChildComponent />}
                    />,
                  );
                });
              }

              return routes;
            })}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
