<?php

include ('DB_connect.php');

//check if delete task function has been called
if (isset($_GET["del_id"]))
{
				$del_id = json_decode($_GET["del_id"], false);
				$outp = delete_task($del_id);
				unset($_GET["del_id"]);
}
//check if edit task function has been called
if (isset($_POST["edit_id"]))
{
				$edit_info = new stdClass();


				$edit_id = json_decode($_POST["edit_id"], false);
				if (isset($_POST["edit_notes"]))
				{
								$edit_notes = $_POST["edit_notes"];
								$edit_info->notes = $edit_notes;
				}
				if (isset($_POST["edit_title"]))
				{
								$edit_title = $_POST["edit_title"];
								$edit_info->title = $edit_title;
				}
				if (isset($_POST["edit_hours"]))
				{
								$edit_hours = $_POST["edit_hours"];
								$edit_info->hours = $edit_hours;
				}

				$outp = edit_task($edit_id, $edit_info);
				unset($_POST["edit_id"]);
				unset($_POST["edit_notes"]);
				$edit_info = null;
}

//check if add task function has been called
if (isset($_POST["title"]))
{
				new_task();
				unset($_POST["title"]);
				unset($_POST["hours"]);
				unset($_POST["notes"]);
				unset($_POST["status"]);

}

//check if move task function has been called
if(isset($_POST["move_id"]))
{
    move_task();
    unset($_POST["move_id"]);
    unset($_POST["new_status"]);
				
}
 function move_task()
 {
    $status = $_POST["new_status"];
    $move_id = $_POST["move_id"];
	           $link = connect_db();
				if ($link->connect_error)
				{
								die("Connection failed: " . $conn->connect_error);
				}
				
				
				$sql = "UPDATE `tasks` SET `task_status`= $status WHERE `task_ID` = $move_id";

				if ($link->query($sql) === true)
				{
								echo "Record updated successfully";
				} else
				{
								echo "Error deleting record: " . $link->error;
				}
 }
function new_task()
{
				$title = $_POST["title"];
				$hours = $_POST["hours"];
				$notes = $_POST["notes"];


				if ($_POST["status"] == "todo")
				{
								$status = 0;
				} else
				{
								$status = 1;
				}

				$link = connect_db();

				$sql = "INSERT INTO `tasks`( `task_title`, `task_hours`, `task_status`, `task_notes`) VALUES (\"$title\",$hours,$status,\"$notes\")";


				$result = mysqli_query($link, $sql);
				if (!$link)
				{
								echo "Error!";
				} else
				{
								header("Refresh:0;url=../index.php");
				}


}


function connect_and_get($status, $keyword, $title)
{
				$link = connect_db();
				$sql = "SELECT `task_title`, `task_hours`, `task_ID`, `task_notes` FROM `tasks` WHERE `task_status` = $status";
				$result = mysqli_query($link, $sql);
				if ($result->num_rows > 0)
				{
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

								while ($row = mysqli_fetch_object($result))
								{
												$name = $row->task_title;
												$id = $row->task_ID;
												$hours = $row->task_hours;
												$totalHours += $hours;
												$rowno++;
												$table = "\"$keyword\"";
												$edit_id = $keyword . "_edit";
												$edit_id = str_replace("\"", "", $edit_id);
												$buttonclass = $keyword . "_button";
												$buttonclass = str_replace("\"", "", $buttonclass);
												$delete_id = $keyword . "_delete";
												$delete_id = str_replace("\"", "", $delete_id);
												$notes_id = $keyword . "_notes_" . $rowno;
												$notes_id = str_replace("\"", "", $notes_id);
												$title_id = $keyword . "_title_" . $rowno;
												$title_id = str_replace("\"", "", $title_id);
												$hours_id = $keyword . "_hours_" . $rowno;
												$hours_id = str_replace("\"", "", $hours_id);
												$yes_id = $keyword . "_yes";
												$yes_id = str_replace("\"", "", $yes_id);
												$error_class = $keyword . "_err";
												$error_class = str_replace("\"", "", $error_class);
                                                $move_err = $keyword . "_move_err";
												$move_err = str_replace("\"", "", $move_err);
												$info_rows = $keyword . "_info";
												$info_rows = str_replace("\"", "", $info_rows);
												$edit_buttons = $keyword . "_editbuttons";
												$edit_buttons = str_replace("\"", "", $edit_buttons);
												$move_button = $keyword . "_move_buttons";
												$move_button = str_replace("\"", "", $move_button);
												$totalhrs = $keyword . "_totalhours";
												$totalhrs = str_replace("\"", "", $totalhrs);
												$notes = $row->task_notes;
												if (empty($row->task_notes))
												{
																$notes = "None";
												}

												echo "  <tr>
                        <td id= '$title_id' onclick='show_info($table,$id, $rowno);'>$name</td>
                        <td id= '$hours_id'>$hours</td>
                    </tr>
                    <tr  class =$info_rows>
                    <td id= '$notes_id' colspan = '2'>Notes: $notes </td>
                    </tr>
                    <tr  class =$info_rows>
                    <td> <button id='$edit_id' onclick='edit_task($id,$table,$rowno)' class ='$buttonclass $keyword'>Edit</button> </td>
                    <td> <button onclick='open_dialogue($id,$delete_id,$table)'  class ='$buttonclass $keyword'>Delete</button> </td>
                    </tr>
                    ";
												if ($keyword == 'todo')
												{
																echo "<tr class ='$move_button'><td><span class='error_class $move_err'></span><button onclick='move($id,$table,\"progress\",$hours,$rowno)' class =' $buttonclass $keyword'>Move to In Progress</button> </td>
                        <td> <button onclick='move($id,$table,\"done\",$hours,$rowno)'  class =' $buttonclass $keyword'>Move to Done</button> </td></tr>";
												} else
																if ($keyword == 'progress')
																{
																					echo "<tr class ='$move_button'><td> <span class='error_class $move_err'></span><button onclick='move($id,$table,\"todo\",$hours,$rowno)' class =' $buttonclass $keyword'>Move to To-Do</button> </td>
                        <td> <button onclick='move($id,$table,\"done\",$hours,$rowno)'  class =' $buttonclass $keyword'>Move to Done</button> </td></tr>";
																}
												echo " <tr  class =$edit_buttons>
                    <td> <span class='error_class $error_class'></span><button  onclick='done_editing($table)' class ='$buttonclass $keyword'>Done</button> </td>
                    <td> <button  onclick='cancel_editing($table)' class ='$buttonclass $keyword'>Cancel</button> </td>
                    </tr>";
								}
								echo " </tbody>
                <tfoot>
                    <tr class = '$keyword'>
                        <td>Total Hours</td>
                        <td id =$totalhrs>$totalHours</td>
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
				if ($link->connect_error)
				{
								die("Connection failed: " . $conn->connect_error);
				}

				$sql = "DELETE FROM `tasks` WHERE `task_ID` = $del_id";
				if ($link->query($sql) === true)
				{
								echo "Record deleted successfully";
				} else
				{
								echo "Error deleting record: " . $link->error;
				}
}

function edit_task($edit_id, $edit_info)
{
				$link = connect_db();
				if ($link->connect_error)
				{
								die("Connection failed: " . $conn->connect_error);
				}
				$sqlpt = "";
				if (isset($edit_info->notes))
				{
								$sqlpt = $sqlpt . ", `task_notes` = \"$edit_info->notes\"";
				}
				if (isset($edit_info->hours))
				{
								$sqlpt = $sqlpt . ",`task_hours` = $edit_info->hours";
				}
				if (isset($edit_info->title))
				{
								$sqlpt = $sqlpt . ",`task_title` = \"$edit_info->title\"";
				}

				//remove starting comma
				$sqlpt = preg_replace('/^,+|,+$/', '', $sqlpt);
				$sql = "UPDATE `tasks` SET $sqlpt WHERE `task_ID` = $edit_id";
				//error_log("all: ".$sql);
				if ($link->query($sql) === true)
				{
								echo "Record updated successfully";
				} else
				{
								echo "Error deleting record: " . $link->error;
				}

}
function get_tasks()
{
				$link = connect_db();
				if ($link->connect_error)
				{
								die("Connection failed: " . $conn->connect_error);
				}
				echo " <div id= 'tasks'>";
				connect_and_get("0", "todo", "To-Do");
				connect_and_get("1", "progress", "In Progress");
				connect_and_get("2", "done", "Done");
				echo "</div>";
}

?>