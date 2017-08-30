<?php
include ('DB_connect.php');
function get_tasks()
{
    $link = connect_db();
    $sql = "SELECT `task_title`, `task_hours` FROM `tasks` WHERE `task_status` = 0";
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) {
        $totalTodoHours = 0;
        echo "  <div id= 'tasks'>
                    <div id= 'todo-div'>
                        <table>
                            <thead>
                                <tr>
                                    <td  colspan='2'>To-Do</td>
                                </tr>
                            </thead>
                            <tbody>";

        while ($row = mysqli_fetch_object($result)) {
            $name = $row->task_title;
            $hours = $row->task_hours;
            $totalTodoHours += $hours;
            echo "  <tr>
                        <td>$name</td>
                        <td>$hours</td>
                    </tr>";
        }
        echo " </tbody>
                <tfoot>
                    <tr>
                        <td>Total Hours</td>
                        <td>$totalTodoHours</td>
                </tr>
                </tfoot>
        </table>       
      </div>";
    }
    
    $sql = "SELECT `task_title`, `task_hours` FROM `tasks` WHERE `task_status` = 1";
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) {
        $totalProgHours = 0;
        echo "  <div id= 'inprogress-div'>
                    <table>
                        <thead>
                            <tr>
                                <td  colspan='2'>In Progress</td>
                            </tr>
                        </thead>
                        <tbody>";

        while ($row = mysqli_fetch_object($result)) {
            $name = $row->task_title;
            $hours = $row->task_hours;
            $totalProgHours += $hours;
            echo "  <tr>
                        <td>$name</td>
                        <td>$hours</td>
                    </tr>";
        }
        echo "  </tbody>
                <tfoot>
                    <tr>
                        <td>Total Hours</td>
                        <td>$totalProgHours</td>
                    </tr>
                </tfoot>
            </table>       
        </div>";

    }
    $sql = "SELECT `task_title`, `task_hours` FROM `tasks` WHERE `task_status` = 2";
    $result = mysqli_query($link, $sql);
    if ($result->num_rows > 0) {
        $totalDoneHours = 0;
        echo "  <div id= 'done-div'>
                    <table>
                        <thead>
                            <tr>
                                <td  colspan='2'>Done</td>
                            </tr>
                        </thead>
                        <tbody>";

        while ($row = mysqli_fetch_object($result)) {
            $name = $row->task_title;
            $hours = $row->task_hours;
            $totalDoneHours += $hours;
            echo "  <tr>
                        <td>$name</td>
                        <td>$hours</td>
                    </tr>";
        }
        echo "  </tbody>
                <tfoot>
                    <tr>
                        <td>Total Hours</td>
                        <td>$totalDoneHours</td>
                    </tr>
                </tfoot>
            </table>       
        </div>";

    }
    echo "</div>";

}
?>