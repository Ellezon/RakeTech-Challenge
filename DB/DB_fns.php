<?php
include ('DB_connect.php');
function get_tasks()
{
    $link = connect_db();
    $sql = "SELECT * FROM `tasks`";
    $tasks = [];
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) 
    {
        while ($row = mysqli_fetch_object($result)) 
        {
            $name = $row->task_title;
            array_push($tasks, $name);
            //echo "<tr><td><h1>$name</h1></td><td></td><td></td></tr>";
        }
        return $tasks;
    }
    return [];
}

?>