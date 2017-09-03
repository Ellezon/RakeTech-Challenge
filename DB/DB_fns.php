<?php

include ('DB_connect.php');

//check if delete task function has been called
if (isset($_GET["del_id"])) {
				$del_id = json_decode($_GET["del_id"], false);
				$outp = delete_task($del_id);
				unset($_GET["del_id"]);
}
//check if edit task function has been called
if (isset($_POST["edit_id"])) {
				$edit_info = new stdClass();


				$edit_id = json_decode($_POST["edit_id"], false);
				if (isset($_POST["edit_notes"])) {
								$edit_notes = $_POST["edit_notes"];
								$edit_info->notes = $edit_notes;
				}
				if (isset($_POST["edit_title"])) {
								$edit_title = $_POST["edit_title"];
								$edit_info->title = $edit_title;
				}
				if (isset($_POST["edit_hours"])) {
								$edit_hours = $_POST["edit_hours"];
								$edit_info->hours = $edit_hours;
				}

				$outp = edit_task($edit_id, $edit_info);
				unset($_POST["edit_id"]);
				unset($_POST["edit_notes"]);
				$edit_info = null;
}

//check if add task function has been called
if (isset($_POST["title"])) {
				new_task();
				unset($_POST["title"]);
				unset($_POST["hours"]);
				unset($_POST["notes"]);
				unset($_POST["status"]);

}

//check if move task function has been called
if (isset($_POST["move_id"])) {
				move_task();
				unset($_POST["move_id"]);
				unset($_POST["new_status"]);

}

/*
    Change status of task in DB
 */
function move_task()
{               //get id and new status
				$status = $_POST["new_status"];
				$move_id = $_POST["move_id"];
                
                //connnect to DB
				$link = connect_db();
				if ($link->connect_error) {
								die("Connection failed: " . $conn->connect_error);
				}

                //create query
				$sql = "UPDATE `tasks` SET `task_status`= $status WHERE `task_ID` = $move_id";
                
                //run query
				if ($link->query($sql) === true) {
								echo "Record updated successfully";
				}
				else {
								echo "Error deleting record: " . $link->error;
				}
}


/*
    Add a new task to DB 
 */
function new_task()
{
                //get new task details
				$title = $_POST["title"];
				$hours = $_POST["hours"];
				$notes = $_POST["notes"];
        
                //set correct status based on table selected
				if ($_POST["status"] == "todo") {
								$status = 0;
				}
				else {
								$status = 1;
				}
                
                //connect to DB
				$link = connect_db();
                
                //create query
				$sql = "INSERT INTO `tasks`( `task_title`, `task_hours`, `task_status`, `task_notes`) VALUES (\"$title\",$hours,$status,\"$notes\")";

                //run query
				$result = mysqli_query($link, $sql);
				if (!$link) {
								echo "Error!";
				}
				else {
								header("Refresh:0;url=../index.php");
				}
}

/*
    Connect to DB and get task details. Display them tables in  the index page 
 */
function connect_and_get($status, $keyword, $title)
{
                //connect to DB
				$link = connect_db();
                
                //create query
				$sql = "SELECT `task_title`, `task_hours`, `task_ID`, `task_notes` FROM `tasks` WHERE `task_status` = $status";
                
                //run query
				$result = mysqli_query($link, $sql);
                
                //if task exist, display tables and tasks
				if ($result->num_rows > 0) {
				                //initilise variables
								$totalHours = 0; //hold total hours of the table
								$rowno = -1;  //holds the row number for current task in the table
                                
                                //start displaying table
								echo " 
                    <div id= '$keyword-div'>
                        <table>
                            <thead>
                                <tr class = '$keyword'>
                                    <td  colspan='2'>$title</td>
                                </tr>
                            </thead>
                            <tbody>";
                                    
                                //for each task, create a row and edit,move and delete buttons
								while ($row = mysqli_fetch_object($result)) {
								                //get task details
												$name = $row->task_title;
												$id = $row->task_ID;
												$hours = $row->task_hours;
                                                $notes = $row->task_notes;
                                                
                                                //update row numb and total hours
												$totalHours += $hours;
												$rowno++;
                                                
                                                //set classes and ids
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
												
                                                //if notes is empty set notes to None
                                                if (empty($notes)) {
																$notes = "None";
												}
            
                                                //display task name and hours in table row and create edit and delete buttons 
												echo " <tr>
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
                                                
                                                //create the correct move buttons according to table 
												if ($keyword == 'todo') {
																echo "<tr class ='$move_button'><td><span class='error_class $move_err'></span><button onclick='move($id,$table,\"progress\",$hours,$rowno)' class =' $buttonclass $keyword'>Move to In Progress</button> </td>
                        <td> <button onclick='move($id,$table,\"done\",$hours,$rowno)'  class =' $buttonclass $keyword'>Move to Done</button> </td></tr>";
												}
												else if ($keyword == 'progress') {
																				echo "<tr class ='$move_button'><td> <span class='error_class $move_err'></span><button onclick='move($id,$table,\"todo\",$hours,$rowno)' class =' $buttonclass $keyword'>Move to To-Do</button> </td>
                        <td> <button onclick='move($id,$table,\"done\",$hours,$rowno)'  class =' $buttonclass $keyword'>Move to Done</button> </td></tr>";
																}
												echo " <tr  class =$edit_buttons>
                    <td> <span class='error_class $error_class'></span><button onclick='done_editing($table)' class ='$buttonclass $keyword'>Done</button> </td>
                    <td> <button  onclick='cancel_editing($table)' class ='$buttonclass $keyword'>Cancel</button> </td>
                    </tr> ";
								}
                                //display total hours in table footer and create delete dialogue
								echo " </tbody>
                <tfoot>
                    <tr class = '$keyword'>
                        <td>Total Hours :</td>
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


/*
    Connect to DB and delete task 
 */
function delete_task($del_id)
{
                //connect to DB
				$link = connect_db();
				if ($link->connect_error) {
								die("Connection failed: " . $conn->connect_error);
				}
                
                //create query
				$sql = "DELETE FROM `tasks` WHERE `task_ID` = $del_id";
                
                //run query
				if ($link->query($sql) === true) {
								echo "Record deleted successfully";
				}
				else {
								echo "Error deleting record: " . $link->error;
				}
}

/*
    Connect to DB and edit task 
 */
function edit_task($edit_id, $edit_info)
{
                //connect to DB
				$link = connect_db();
				if ($link->connect_error) {
								die("Connection failed: " . $conn->connect_error);
				}
                
                //set which task values are to be updated 
				$sqlpt = "";
				if (isset($edit_info->notes)) {
								$sqlpt = $sqlpt . ", `task_notes` = \"$edit_info->notes\"";
				}
				if (isset($edit_info->hours)) {
								$sqlpt = $sqlpt . ",`task_hours` = $edit_info->hours";
				}
				if (isset($edit_info->title)) {
								$sqlpt = $sqlpt . ",`task_title` = \"$edit_info->title\"";
				}

				//remove starting comma
				$sqlpt = preg_replace('/^,+|,+$/', '', $sqlpt);
                
                //create query
				$sql = "UPDATE `tasks` SET $sqlpt WHERE `task_ID` = $edit_id";
    
                //run query
				if ($link->query($sql) === true) {
								echo "Record updated successfully";
				}
				else {
								echo "Error deleting record: " . $link->error;
				}

}


/*
    Get all tasks and display them
 */
function get_tasks()
{
				echo " <div id= 'tasks'>";
                
                //get todo tasks
				connect_and_get("0", "todo", "To-Do");
                
                //get in progress tasks
				connect_and_get("1", "progress", "In Progress");
                
                //get done tasks
				connect_and_get("2", "done", "Done");
				echo "</div>";
}

?>