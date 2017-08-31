<?php
include ('DB_connect.php');
if (isset($_GET["id"])) {
    $obj = json_decode($_GET["id"], false);
    $outp = get_info($obj);
    $outp = str_replace('"', '', $outp);
    echo json_encode($outp);
    unset($_GET["id"]);
}

function connect_and_get($status, $keyword, $title)
{
    $link = connect_db();
    $sql = "SELECT `task_title`, `task_hours`, `task_ID`, `task_notes` FROM `tasks` WHERE `task_status` = $status";
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) {
        $totalHours = 0;
        $rowno = -1;

        echo "  <div id= 'tasks'>
                    <div id= '$keyword-div'>
                        <table>
                            <thead>
                                <tr>
                                    <td  colspan='2'>$title</td>
                                </tr>
                            </thead>
                            <tbody>";

        while ($row = mysqli_fetch_object($result)) {
            $name = $row->task_title;
            $hours = $row->task_hours;
            $totalHours += $hours;
            $table = "\"$keyword\"";
            $classname = $keyword."_notes";
            $classname = str_replace("\"","",$classname);
            $rowno++;
            $notes = $row->task_notes;
            if (empty($row->task_notes)) {
                $notes = "None";
            }
            
            
            echo "  <tr>
                        <td onclick='get_info($table,$row->task_ID, $rowno);'>$name</td>
                        <td>$hours</td>
                    </tr>
                    <tr  class =$classname>
                    <td colspan = '2'>Notes: $notes </td>
                    </tr>";
        }
        echo " </tbody>
                <tfoot>
                    <tr>
                        <td>Total Hours</td>
                        <td>$totalHours</td>
                </tr>
                </tfoot>
        </table>       
      </div>";

    }
}

function get_tasks()
{
    $link = connect_db();
    connect_and_get("0", "todo", "To-Do"); 
    connect_and_get("1", "progress", "In Progress"); 
    connect_and_get("2", "done", "Done"); 
}

?>