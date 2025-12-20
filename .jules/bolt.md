# Bolt's Journal

## 2024-05-22 - Heavy Calculations in Render Body
**Learning:** Several dashboard components (`AdminDashboard`, `ReportsAnalytics`) perform heavy data processing (filtering, sorting, reducing) directly in the render body. This causes unnecessary recalculations on every re-render (e.g., when typing in inputs or changing tabs).
**Action:** Use `useMemo` to cache expensive derived state like sorted lists and statistical aggregations.
