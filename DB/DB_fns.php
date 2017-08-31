<?php
include ('DB_connect.php');
if (isset($_GET["del_id"])) {
    $del_id = json_decode($_GET["del_id"], false);
    $outp = delete_task($del_id);
    unset($_GET["del_id"]);
}


function connect_and_get($status, $keyword, $title)
{
    $link = connect_db();
    $sql = "SELECT `task_title`, `task_hours`, `task_ID`, `task_notes` FROM `tasks` WHERE `task_status` = $status";
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) {
        $totalHours = 0;
        $rowno = -1;

        echo " 
                    <div id= '$keyword-div'>
                        <table>
                            <thead>
                                <tr class = '$keyword'>
                                    <td  colspan='2'>$title</td>
                                </tr>
                            </thead>
                            <tbody>";

        while ($row = mysqli_fetch_object($result)) {
            $name = $row->task_title;
            $hours = $row->task_hours;
            $totalHours += $hours;
            $table = "\"$keyword\"";
            $buttonclass = $keyword."_button";
            $buttonclass = str_replace("\"","",$buttonclass);
            $delete_id = $keyword."_delete";
            $delete_id = str_replace("\"","",$delete_id);
            $yes_id = $keyword."_yes";
            $yes_id  = str_replace("\"","",$yes_id );
            $classname = $keyword."_notes";
            $classname = str_replace("\"","",$classname);
            $rowno++;
            $notes = $row->task_notes;
            if (empty($row->task_notes)) {
                $notes = "None";
            }
            
            echo "  <tr>
                        <td onclick='show_info($table,$row->task_ID, $rowno);'>$name</td>
                        <td>$hours</td>
                    </tr>
                    <tr  class =$classname>
                    <td colspan = '2'>Notes: $notes </td>
                    </tr>
                    <tr  class =$classname>
                    <td> <button class ='$buttonclass $keyword'>Edit</button> </td>
                    <td> <button onclick='open_dialogue($row->task_ID,$delete_id,$table)'  class ='$buttonclass $keyword'>Delete</button> </td>
                    </tr>
                    ";
        }
        echo " </tbody>
                <tfoot>
                    <tr class = '$keyword'>
                        <td>Total Hours</td>
                        <td>$totalHours</td>
                </tr>
                </tfoot>
        </table>       
      </div>
      <div id='$delete_id' title='Delete task ?'>
        <button id = '$yes_id' class='$keyword'> Yes </button>
        <button onclick='close_dialogue($delete_id);' id='close' class='$keyword'> Cancel </button>
      </div>";
 

    }
}

function delete_task($del_id)
{
    $link = connect_db();
    if ($link->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

    $sql = "DELETE FROM `tasks` WHERE `task_ID` = $del_id";
    if ($link->query($sql) === TRUE) {
    echo "Record deleted successfully";
    } else {
    echo "Error deleting record: " . $link->error;
}
    
           
}
function get_tasks()
{
    $link = connect_db();
    if ($link->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
    echo " <div id= 'tasks'>";
    connect_and_get("0", "todo", "To-Do"); 
    connect_and_get("1", "progress", "In Progress"); 
    connect_and_get("2", "done", "Done"); 
    echo "</div>";
}

?>