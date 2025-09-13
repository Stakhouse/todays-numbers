Task: Adjust user login and navbar behavior to clearly separate admin and client functionalities.

Requirements:

Client Login

When a user logs in as a client, they should only be able to access the All Islands page (current homepage).

Clients should not have access to admin features, additional tabs, or other pages.

Ensure that routing is restricted, so clients cannot access pages directly via URL.

Navbar Dropdown

Remove the dropdown from the navbar (top task bar), as it currently has no function and is unnecessary.

Admin Login

Admins retain full access to all pages, tabs, and features.

Role-Based Access Control

Implement or confirm proper role-based access so the UI components and routes are conditionally rendered based on the user's role.

Outcome:

Clients see only the All Islands page.

Admins see all tabs and functionality.

Navbar is simplified with no unused dropdowns.