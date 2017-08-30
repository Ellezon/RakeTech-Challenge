<?php
include ('DB_connect.php');
function get_tasks()
{
    $link = connect_db();
    $sql = "SELECT * FROM `tasks`";
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) 
    {
        echo "<table  border = \"1\" style=\"width:80%; table-layout: fixed;text-align:center;   margin-left:10%\";>";
        
        while ($row = mysqli_fetch_object($result)) 
        {
            
            $name = $row->task_title;								  
            echo "<tr><td><h1>$name</h1></td>";
        }
        echo "</table>";
    }
}

?>