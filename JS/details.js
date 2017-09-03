//global variables (used for editing tasks)
var task_id = null;
var notes_elemid = null;
var title_elemid = null;
var hours_elemid = null;
var totalhours_elemid = null;
var editing = false;
var notes_value = null;
var title_value = null;
var hours_value = null;
var row_no = null;


/*
    Move a task from old_table to table
*/
function move(id, old_table, new_table, hours, row_no)
{
	//hide move error
	var err_class = old_table + '_move_err';
	document.getElementsByClassName(err_class)[row_no].style.display = 'none';

	//get total hours of new table. If table hasn't been made yet set to 0
	var table_id = "#" + new_table + '_totalhours';
	var totalhrs = 0;
	if ($(table_id).length)
	{
		totalhrs = parseInt($(table_id).text());
	}

	//get hours of task to be moved
	var hours_id = '#' + old_table + '_hours_' + row_no;
	hours = parseInt($(hours_id).text());

	//calculate new_table total
	var new_total = totalhrs + hours;

	//do not move to todo table if task causes total hours to be larger than 24
	if (new_table == 'todo' && new_total > 24)
	{
		document.getElementsByClassName(err_class)[row_no].innerHTML = 'Total hours must remain under 25!';
		document.getElementsByClassName(err_class)[row_no].style.display = 'block';
		return;
	}

	//do not move to in progress table if task causes total hours to be larger than 8
	else if (new_table == 'progress' && new_total > 8)
	{
		document.getElementsByClassName(err_class)[row_no].innerHTML = 'Total hours must remain under 9!';
		document.getElementsByClassName(err_class)[row_no].style.display = 'block';
		return;
	}

	//set the status to be passed to DB
	var status;
	switch (new_table)
	{
	case 'todo':
		status = 0;
		break;
	case 'progress':
		status = 1;
		break;
	case 'done':
		status = 2;
		break;
	}

	//send data to DB_fns.php to be sent to DB
	$.ajax(
	{
		data: {
			'move_id': id,
			'new_status': status
		},
		url: '../DB/DB_fns.php',
		method: 'POST',
		success: function(msg)
		{
			//if successful reload page
			location.reload();
		}
	});
};


/*
    Show the Move task buttons when not in editing mode 
*/
function show_move_buttons(table, row)
{
	if (!editing)
	{
		var move_buttons = table + '_move_buttons';
		if (table == "todo" || table == "progress")
		{
			if (document.getElementsByClassName(move_buttons)[row].style.display == "table-row")
			{
				document.getElementsByClassName(move_buttons)[row].style.display = "none";
			}
			else
			{
				document.getElementsByClassName(move_buttons)[row].style.display = "table-row";
			}
		}
	}
};


/*
    Show the add task form when Add Task button is pressed 
*/
function show_add_task()
{
	var form = document.getElementById('new_task');
	if (form.style.display == 'block')
	{
		form.style.display = 'none';
	}
	else
	{
		form.style.display = 'block';
	}
};


/*
    Show task information when not in editing mode 
    Hide any move errors
*/
function show_info(table, id, rowno)
{
	if (!editing)
	{
		var info_classname = table + "_info";
		var error_name = table + '_move_err';
		if (document.getElementsByClassName(info_classname)[rowno + rowno].style.display == "table-row")
		{
			document.getElementsByClassName(info_classname)[rowno + rowno].style.display = "none";
			document.getElementsByClassName(info_classname)[rowno + rowno + 1].style.display = "none";
		}
		else
		{
			document.getElementsByClassName(info_classname)[rowno + rowno].style.display = "table-row";
			document.getElementsByClassName(info_classname)[rowno + rowno + 1].style.display = "table-row";
			if(table != 'done')
            {
                    document.getElementsByClassName(error_name)[rowno].style.display = "none";
            }
		}
		show_move_buttons(table, rowno);
	}
};


/*
    Open the delete dialogue
*/
function open_dialogue(id, delete_id, keyword)
{
	var idname = "#" + keyword + "_yes";
	$(delete_id).dialog(
	{
		minHeight: 30
	});
	$(idname).click(function()
	{
		//send task ID to PHP to delete task from DB
		$.ajax(
		{
			data: 'del_id=' + id,
			url: '../DB/DB_fns.php',
			method: 'GET',
			success: function(msg)
			{
				location.reload();
			}
		});
	})
};


/*
  close delete dialogue
*/
function close_dialogue(delete_id)
{
	$(delete_id).dialog("destroy");
};


/*
    Change the title, hours and notes fields to input fields for editing
*/
function edit_task(id, keyword, in_rowno)
{
	row_no = in_rowno;
	//get task details elements
	notes_elemid = "#" + keyword + "_notes_" + row_no;
	title_elemid = "#" + keyword + "_title_" + row_no;
	hours_elemid = "#" + keyword + "_hours_" + row_no;
	totalhours_elemid = "#" + keyword + '_totalhours';

	//get current details to populate input fields
	task_id = id;
	notes_value = $(notes_elemid).text();
	title_value = $(title_elemid).text();
	hours_value = $(hours_elemid).text();

	//prevent 'Notes:' from displaying
	notes_value = notes_value.split(": ");
	notes_value = notes_value[1];

	//set editing to true;
	editing = true;

	//change the details to input fields
	//notes
	$(notes_elemid).html('');
	$('<input></input>').attr(
	{
		'class': 'editing',
		'value': notes_value,
		'type': 'text',
		'size': '10',
		'id': 'notes_editing'
	}).appendTo(notes_elemid);

	//hours
	$(hours_elemid).html('');
	$('<input></input>').attr(
	{
		'class': 'editing',
		'value': hours_value,
		'size': '2',
		'type': 'number',
		'id': 'hours_editing'
	}).appendTo(hours_elemid);

	//title
	$(title_elemid).html('');
	$('<input></input>').attr(
	{
		'class': 'editing',
		'value': title_value,
		'size': '5',
		'type': 'text',
		'id': 'title_editing'
	}).appendTo(title_elemid);

	//focus on title field
	$('#title_editing').focus();

	//remove edit and delete buttons and show done and cancel buttons
	var classname = keyword + "_info";
	document.getElementsByClassName(classname)[row_no + row_no + 1].style.display = "none";

	classname = keyword + "_editbuttons";
	document.getElementsByClassName(classname)[row_no].style.display = "table-row";

	//hide move buttons
	if (keyword == "todo" || keyword == "progress")
	{
		var move_buttons = keyword + "_move_buttons";
		document.getElementsByClassName(move_buttons)[row_no].style.display = "none";
	}

	//clear edit error
	var err_classname = keyword + '_err';
	document.getElementsByClassName(err_classname)[row_no].innerHTML = '';

	//make title seem unclickable
	var title_classname = keyword + '_title_' + row_no;
	document.getElementById(title_classname).style.cursor = 'auto';
};


/*
    Check that the total hours for table remains within the correct range when adding new task
*/
function check_total_hours()
{
	//hide add new task errors
	var err_classname = 'submit_err';
	document.getElementById(err_classname).style.display = 'none';

	// get value of selected 'status' radio button
	var keyword = getRadioVal(document.getElementById('new_task'), 'status');

	//if table hasn't been made yet set total hours to 0
	var tothours = 0;
	var table_total_hours = '#' + keyword + '_totalhours';

	//if table exists grab total hours value
	if ($(table_total_hours).length)
	{
		tothours = parseInt($(table_total_hours).text());
	}

	//calculate new total hours for table if task is added
	var new_total = tothours + parseInt($('#form_hours').val());


	//if adding to To Do table and total will go above 24 hours, display error and disable submit button
	if (keyword == 'todo' && new_total > 24)
	{
		document.getElementById(err_classname).innerHTML = 'Error! Total hours must remain under 25!';
		document.getElementById(err_classname).style.display = 'block';
		$('#submit_button').attr("disabled", true);
		//prevent submit
		return false;
	}

	//if adding to In Progress table and total will go above 8 hours, display error and disable submit button
	else if (keyword == 'progress' && new_total > 8)
	{
		document.getElementById(err_classname).innerHTML = 'Error! Total hours must remain under 9!';
		document.getElementById(err_classname).style.display = 'block';
		$('#submit_button').attr("disabled", true);
		//prevent submit
		return false;
	}
	//if all is ok, enable submit button
	else
	{
		$('#submit_button').attr("disabled", false);
		return true;
	}
};


/*
    Get the value of radio button
*/
function getRadioVal(form, name)
{
	var val;
	// get list of radio buttons with specified name
	var radios = form.elements[name];
	// loop through list of radio buttons
	for (var i = 0, len = radios.length; i < len; i++)
	{
		if (radios[i].checked)
		{
			// radio checked?
			val = radios[i].value; // if so, hold its value in val
			break; // and break out of for loop
		}
	}
	return val; // return value of checked radio or undefined if none checked
};


/*
    If Done is pressed, check inputed details and send to DB if correct
*/
function done_editing(keyword)
{
	//calculate new total hours for table if edit takes place
	var difference = hours_value - parseInt($('#hours_editing').val());
	var totalhours = parseInt($(totalhours_elemid).text()) - difference;

	//get class of edit error 
	var err_classname = keyword + '_err';

	//if 'hours' is left empty, display edit error
	if ($('#hours_editing').val() == "")
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Number of hours required!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}

	//if title is left empty,display edit error
	if ($('#title_editing').val().length == 0)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Title required!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}

	//if 'hours' is set to a negative number,display edit error
	if ($('#hours_editing').val() <= 0)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Number of hours must be positive and larger than 0!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}

	//if editing in todo table and total hours exceeds 24, display error
	if (keyword == 'todo' && totalhours > 24)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Total hours must remain under 25!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}

	//if editing in inprogress table and total hours exceeds 8, display error
	else if (keyword == 'progress' && totalhours > 8)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Total hours must remain under 9!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}
	//if all is correct, remove any showing errors
	document.getElementsByClassName(err_classname)[row_no].style.display = 'none';

	//set notes to 'None' if nothing is inputted, else optain new edited value
	if ($('#notes_editing').val().length == 0)
	{
		notes_value = "None";
	}
	else
	{
		notes_value = $('#notes_editing').val();
	}

	//get newly edit values
	title_value = $('#title_editing').val();
	hours_value = $('#hours_editing').val();

	//set the original task detail elements to new values
	$(totalhours_elemid).text(totalhours);
	$(notes_elemid).text("Notes: " + notes_value);
	$(title_elemid).text(title_value);
	$(hours_elemid).text(hours_value);

	//send changed to DB
	$.ajax(
	{
		data: {
			'edit_id': task_id,
			'edit_notes': notes_value,
			'edit_title': title_value,
			'edit_hours': hours_value
		},
		url: '../DB/DB_fns.php',
		method: 'POST'
	});

	//Exit editing mode
	stop_editing(keyword);
};


/*
   Exit editing mode 
*/
function stop_editing(keyword)
{
	//remove move error if showing
    if(keyword!= 'done')
	{
	   //remove move error if showing
	   var error_name = keyword + '_move_err';
	   document.getElementsByClassName(error_name)[row_no].style.display = "none";
    }
	
    //show move buttons
    editing = false;
	show_move_buttons(keyword, row_no);
	
    //show edit and delete buttons and hide edit options
	var classname = keyword + "_info";
	document.getElementsByClassName(classname)[row_no + row_no + 1].style.display = "table-row";
	classname = keyword + "_editbuttons";
	document.getElementsByClassName(classname)[row_no].style.display = "none";
	
    //make title appear clickable once more
	var title_classname = keyword + '_title_' + row_no;
	document.getElementById(title_classname).style.cursor = 'pointer';
	
    //clear global vars
	task_id = null;
	notes_elemid = null;
	title_elemid = null;
	totalhours_elemid = null;
	hours_elemid = null;
	notes_value = null;
	title_value = null;
	hours_value = null;
	row_no = null;
}

/*
   Cancel edit mode 
*/
function cancel_editing(keyword)
{
    //revert values to old values
	$(notes_elemid).html("Notes: " + notes_value);
	$(title_elemid).html(title_value);
	$(hours_elemid).html(hours_value);
    
    //exit editing mode
	stop_editing(keyword);
}

