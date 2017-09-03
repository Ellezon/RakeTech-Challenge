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

function move(id, old_table, table, hours, row_no)
{
     var err_class = old_table+ '_move_err';
    document.getElementsByClassName(err_class)[row_no].style.display = 'none';
	
	//get total hours of new table
    var table_id = "#"+ table+'_totalhours';
    var totalhrs = 0;
    if( $(table_id).length)
    {
        totalhrs = parseInt($(table_id).text());
    }
   	var new_total = totalhrs+hours;

	if (table == 'todo' && new_total > 24)
	{
		document.getElementsByClassName(err_class)[row_no].innerHTML = 'Total hours must remain under 24!';
		document.getElementsByClassName(err_class)[row_no].style.display = 'block';
        return;
	}
	else if (table == 'progress' && new_total > 8)
	{
		document.getElementsByClassName(err_class)[row_no].innerHTML = 'Total hours must remain under 8!';
		document.getElementsByClassName(err_class)[row_no].style.display = 'block';
        return;
	}
     
    var status;
    
	switch(table) {
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
    	$.ajax({
		data: {
			'move_id': id,
			'new_status': status
		},
		url: '../DB/DB_fns.php',
		method: 'POST',
        success: function(msg)
			{
				location.reload();
			}
	});
   
    
    
};

function show_move_buttons(table,row)
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


function check_total_hours()
{
    	var err_classname = 'submit_err';
		document.getElementById(err_classname).style.display = 'none';
	// get value of selected 'status' radio button
	var keyword = getRadioVal(document.getElementById('new_task'), 'status');
	//update total hours
	var difference = hours_value - $('#form_hours').val();
    if($('#form_hours').val() < 0)
    {
		$('#submit_button').attr("disabled", true);
    }
	totalhours_elemid = "#" + keyword + '_totalhours';
	var totalhours = $(totalhours_elemid).text() - difference;

	if (keyword == 'todo' && totalhours > 24)
	{
		document.getElementById(err_classname).innerHTML = 'Error! Total hours must remain under 24!';
		document.getElementById(err_classname).style.display = 'block';
		$('#submit_button').attr("disabled", true);
	}
	else if (keyword == 'progress' && totalhours > 8)
	{
		document.getElementById(err_classname).innerHTML = 'Error! Total hours must remain under 8!';
		document.getElementById(err_classname).style.display = 'block';
		$('#submit_button').attr("disabled", true);
	}
	else
	{
		$('#submit_button').attr("disabled", false);
	}
};

function getRadioVal(form, name)
{
	var val;
	// get list of radio buttons with specified name
	var radios = form.elements[name];
	// loop through list of radio buttons
	for (var i = 0, len = radios.length; i < len; i++)
	{
		if (radios[i].checked)
		{ // radio checked?
			val = radios[i].value; // if so, hold its value in val
			break; // and break out of for loop
		}
	}
	return val; // return value of checked radio or undefined if none checked
};

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

function show_info(table, id, rowno)
{
	if (!editing)
	{
		var info_classname = table + "_info";
		if (document.getElementsByClassName(info_classname)[rowno + rowno].style.display == "table-row")
		{
			document.getElementsByClassName(info_classname)[rowno + rowno].style.display = "none";
			document.getElementsByClassName(info_classname)[rowno + rowno + 1].style.display = "none";
		}
		else
		{
			document.getElementsByClassName(info_classname)[rowno + rowno].style.display = "table-row";
			document.getElementsByClassName(info_classname)[rowno + rowno + 1].style.display = "table-row";
		}
		show_move_buttons(table,rowno);
	}
};

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

function cancel_editing(keyword)
{
	$(notes_elemid).html("Notes: " + notes_value);
	$(title_elemid).html(title_value);
	$(hours_elemid).html(hours_value);;
	stop_editing(keyword);
}

function stop_editing(keyword)
{
	editing = false;
	show_move_buttons(keyword,row_no);
	//show edit and delete buttons and hide edit options
	var classname = keyword + "_info";
	document.getElementsByClassName(classname)[row_no + row_no + 1].style.display = "table-row";
	classname = keyword + "_editbuttons";
	document.getElementsByClassName(classname)[row_no].style.display = "none";
	editing = false;
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

function edit_task(id, keyword, in_rowno)
{
	row_no = in_rowno;
	notes_elemid = "#" + keyword + "_notes_" + row_no;
	title_elemid = "#" + keyword + "_title_" + row_no;
	hours_elemid = "#" + keyword + "_hours_" + row_no;
	totalhours_elemid = "#" + keyword + '_totalhours';
    
	//edit_id = "#" +keyword + "_edit";
	task_id = id;
	notes_value = $(notes_elemid).text();
	title_value = $(title_elemid).text();
	hours_value = $(hours_elemid).text();
	//prevent 'Notes:' from displaying
	notes_value = notes_value.split(": ");
	notes_value = notes_value[1];
	$(notes_elemid).html('');
	$('<input></input>').attr(
	{
	   'class' : 'editing',
		'value': notes_value,
		'type': 'text',
        'size' : '10',
		'id': 'notes_editing'
        
	}).appendTo(notes_elemid);

    //$(notes_elemid).input.validity.valid;
	$(hours_elemid).html('');
	$('<input></input>').attr(
	{
	    'class' : 'editing',
		'value': hours_value,
		'size': '2',
		'type': 'number',
		'id': 'hours_editing'
	}).appendTo(hours_elemid);
	editing = true;
	$(title_elemid).html('');
	$('<input></input>').attr(
	{
	    'class' : 'editing',
		'value': title_value,
		'size': '5',
		'type': 'text',
		'id': 'title_editing'
	}).appendTo(title_elemid);
    
	$('#title_editing').focus();
	//remove edit and delete buttons and show done and cancel buttons
	var classname = keyword + "_info";
	document.getElementsByClassName(classname)[row_no + row_no + 1].style.display = "none";
	classname = keyword + "_editbuttons";
	document.getElementsByClassName(classname)[row_no].style.display = "table-row";
	if (keyword == "todo" || keyword == "progress")
	{
		//hide move buttons
		var move_buttons = keyword + "_move_buttons";
		document.getElementsByClassName(move_buttons)[row_no].style.display = "none";
	}
	//remove error
	var err_classname = keyword + '_err';
	document.getElementsByClassName(err_classname)[row_no].innerHTML = '';
	//make title seem unclickable
	var title_classname = keyword + '_title_' + row_no;

	document.getElementById(title_classname).style.cursor = 'auto';
};

function done_editing(keyword)
{
	//update total hours
	var difference = hours_value - $('#hours_editing').val();
	var totalhours = $(totalhours_elemid).text() - difference;
	var err_classname = keyword + '_err';
  
    if ($('#hours_editing').val() == "")
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Number of hours required!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}
   
    if ($('#title_editing').val().length == 0)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Title required!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}
    
    
    
    if ($('#hours_editing').val() <0)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Number of hours must be positive!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}
	if (keyword == 'todo' && totalhours > 24)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Total hours must remain under 24!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}
	else if (keyword == 'progress' && totalhours > 8)
	{
		document.getElementsByClassName(err_classname)[row_no].innerHTML = 'Error! Total hours must remain under 8!';
		document.getElementsByClassName(err_classname)[row_no].style.display = 'block';
		return;
	}
	document.getElementsByClassName(err_classname)[row_no].style.display = 'none';
	if ($('#notes_editing').val().length == 0)
	{
		notes_value = "None";
	}else
    { 
        notes_value = $('#notes_editing').val();
    }
	title_value = $('#title_editing').val();
	hours_value = $('#hours_editing').val();
	$(totalhours_elemid).text(totalhours);
	$(notes_elemid).text("Notes: " + notes_value);
	$(title_elemid).text(title_value);
	$(hours_elemid).text(hours_value);
	//when finished editing send changed to DB
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
	stop_editing(keyword);
};

function close_dialogue(delete_id)
{
	$(delete_id).dialog("destroy");
};