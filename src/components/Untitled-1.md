GET /users (Paginated List)
Purpose: Dashboard overview of all users
Returns:
List of users
Total count
Pagination info
Basic user details
Account status
http://localhost:5000/users?skip=0&limit=10

GET /users/{id} (Detailed View)
Purpose: View complete user profile
Returns:
Detailed user information
Registration details
Last login info
Session history
Account status


GET /users/search
Purpose: Quick user lookup
Search by:
Name
Email
Phone number
Registration date
Returns: Same format as paginated list


GET /users/stats
Purpose: Analytics dashboard
Returns:
Total users count
Active users count
Inactive users count
New users (last 7/30 days)
User growth trends


GET /users/{id}/activity
Purpose: User monitoring
Returns:
Login history
Session durations
Feature usage
Last active timestamp
Device information