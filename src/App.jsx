import React, { useState, useEffect } from 'react';
import UserSurveyPage from './pages/UserSurveyPage';
import AdminPage from './pages/AdminPage';

/**
 * Main Application Router:
 * Strictly segregates User (participant) experience from Facilitator (admin) tools:
 * 
 * - USER VIEW (/ or /?scenario=...):
 *   Clean, distraction-free audit survey ONLY.
 *   Starts at the minimal/serene Approval Gate ("blank screen at first").
 *   When approved, progresses through the structured message prompts:
 *   15s Look closely -> 60s Spot 3 issues -> 30s Prioritise -> 30s Action pledge -> Certificate.
 *   Styled in soft, muted Herbarium aesthetic (Warm Linen, Twilight Lichen, Aged Tea).
 * 
 * - ADMIN VIEW (/admin, ?admin, #admin):
 *   Complete facilitator station: Multi-scenario stand posters & QR badges,
 *   official facilitator answer keys (PDF Page 3), live submissions database,
 *   CSV export, Google Sheets / free DB setup, and design systems lab.
 */
export default function App({ initialRoute }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (initialRoute) return initialRoute;
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return '/';
  });

  // Track URL changes (pushState, popstate, hashchange)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAdmin = 
    currentPath.includes('/admin') || 
    currentPath.includes('admin=true') || 
    currentPath.includes('?admin') ||
    currentPath.includes('#admin');

  if (isAdmin) {
    return <AdminPage />;
  }

  return <UserSurveyPage />;
}
