
Assumptions: 
- Single user -> No login required 
- A new task can only be added to the todo
- Tasks can have the same name 
- a task must take at least one hour to complete
- Tasks in done can only be moved from the other tables and not created

|---------------------------------------------------------------------|

Technologies used:
-PHP
-JS 
-SQL
-HTML
-CSS
-MAMP
-PHPMyAdmin

|---------------------------------------------------------------------|

DB structure:
table name: task
columns: task_ID,task_title,task_notes,task_hours, task_status

Status explained: 
0 = To-Do
1 = In Progress
2 = Done

|---------------------------------------------------------------------|

Improvements (Future Work):
- Sorting tables according name of task or hours
- Drag and drop to move tasks

|---------------------------------------------------------------------|

Testing
- Responsive 
- Total hours are always kept under 24 for To Do list and under 8 for In Progress
- Checking that DB was changed accordingly (edit, add, delete, move)
- Checking layout of items and when items should be displayed

|---------------------------------------------------------------------|
