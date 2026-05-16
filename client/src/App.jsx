import React, { Suspense, useMemo } from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import { useProfile } from "./contexts/ProfileContext.jsx";
import { routesConfig } from "./config/routesConfig";
import { filterRoutesByRole } from "./utils/routeUtils";

function App() {
  const { profile } = useProfile();
  const role = profile?.role;

  // Filter routes based on user role
  const filteredRoutes = useMemo(() => {
    return filterRoutesByRole(routesConfig, role);
  }, [role]);

  // Recursively wrap route elements in Suspense for lazy loading
  const prepareRoutes = (routes) => {
    return routes.map((route) => {
      const Component = route.element;
      return {
        ...route,
        element: (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Component />
          </Suspense>
        ),
        children: route.children ? prepareRoutes(route.children) : undefined,
      };
    });
  };

  const finalRoutes = useMemo(() => prepareRoutes(filteredRoutes), [filteredRoutes]);
  const element = useRoutes(finalRoutes);

  return <ErrorBoundary>{element}</ErrorBoundary>;
}

export default App;
