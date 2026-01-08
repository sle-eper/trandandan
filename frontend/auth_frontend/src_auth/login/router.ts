type RouteHandler = (params?: Record<string, string>) => void;

const routes: Record<string, RouteHandler> = {};

export function addRoute(path: string, handler: RouteHandler) {
  routes[path] = handler;
}

export function navigate(path: string) {
  history.pushState({}, "", path);
  router();
}

function matchDynamicRoute(path: string) {
  for (const route in routes) {
    if (route.includes(":")) {
      const routeParts = route.split("/");
      const pathParts = path.split("/");

      if (routeParts.length !== pathParts.length) continue;

      let params: Record<string, string> = {};
      let isMatch = true;

      routeParts.forEach((part, i) => {
        if (part.startsWith(":")) {
          params[part.slice(1)] = pathParts[i];
        } else if (part !== pathParts[i]) {
          isMatch = false;
        }
      });

      if (isMatch) return { route, params };
    }
  }
  return null;
}

export function initRouter(onNotFound: () => void) {
  window.addEventListener("popstate", router);
  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest("a[data-route]");
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute("href")!);
  });

  router(onNotFound);
}
export function navigateSilent(path: string) {
  history.pushState({}, "", path);
}


function router(onNotFound?: () => void) {
  const path = window.location.pathname;

  if (routes[path]) {
    routes[path]();
    return;
  }

  const dynamicMatch = matchDynamicRoute(path);

  if (dynamicMatch) {
    routes[dynamicMatch.route](dynamicMatch.params);
    return;
  }

  if (onNotFound) onNotFound();
}
