/** Tracks in-app navigations so Back can use history only when it stays inside the app. */
let routeChanges = 0;

/** Wire to <Router onRouteChange>. The first call is the initial route. */
export function trackRouteChange(): void {
  routeChanges++;
}

export function hasInAppHistory(): boolean {
  return routeChanges > 1;
}
