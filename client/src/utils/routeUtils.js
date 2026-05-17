import { useLocation, matchRoutes } from "react-router-dom";
import { useMemo } from "react";
import { routesConfig } from "../config/routesConfig";

/**
 * Custom hook to get the metadata of the currently active route.
 * It uses matchRoutes and useLocation to find the deepest match that has metadata.
 * This is compatible with both standard BrowserRouter and Data Routers.
 */
export function useActiveRoute() {
  const location = useLocation();
  
  // matchRoutes returns the matches for the current location against the config
  const matches = useMemo(() => matchRoutes(routesConfig, location), [location]);
  
  const activeRoute = useMemo(() => {
    if (!matches) return { label: "General" };

    // Reverse matches to find the deepest match first (the actual page)
    const match = [...matches].reverse().find((m) => m.route?.handle?.label);
    
    if (match) {
      return {
        label: match.route.handle.label,
        icon: match.route.handle.icon,
        ...match
      };
    }
    return { label: "General" };
  }, [matches]);

  return activeRoute;
}

/**
 * Filters the routes based on the user's role.
 * Recursively filters children as well.
 */
export const filterRoutesByRole = (routes, role) => {
  return routes
    .filter((route) => !route.roles || (role && route.roles.includes(role)))
    .map((route) => ({
      ...route,
      children: route.children ? filterRoutesByRole(route.children, role) : undefined,
    }));
};
