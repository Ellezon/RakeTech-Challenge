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


function show_info(table, id, rowno)
{
	if (!editing)
	{
		var classname = table + "_info";
		if (document.getElementsByClassName(classname)[rowno + rowno].style.display == "table-row")
		{
			document.getElementsByClassName(classname)[rowno + rowno].style.display = "none";
			document.getElementsByClassName(classname)[rowno + rowno + 1].style.display = "none";
		}
		else
		{
			document.getElementsByClassName(classname)[rowno + rowno].style.display = "table-row";
			document.getElementsByClassName(classname)[rowno + rowno + 1].style.display = "table-row";
		}
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
			// or GET
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
	$(hours_elemid).html(hours_value);
	stop_editing(keyword);
}

function stop_editing(keyword)
{
    //show edit and delete buttons and hide edit options
	var classname = keyword + "_info";
	document.getElementsByClassName(classname)[row_no+row_no+1].style.display = "table-row";
	classname = keyword + "_editbuttons";
	document.getElementsByClassName(classname)[row_no].style.display = "none";
	editing = false;
    
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
		'value': notes_value,
		'type': 'text',
		'id': 'notes_editing'
	}).appendTo(notes_elemid);
	console.log(editing);
	$(hours_elemid).html('');
	$('<input></input>').attr(
	{
		'value': hours_value,
		'size': '2',
		'type': 'text',
		'id': 'hours_editing'
	}).appendTo(hours_elemid);
	editing = true;
	$(title_elemid).html('');
	$('<input></input>').attr(
	{
		'value': title_value,
		'size': '5',
		'type': 'text',
		'id': 'title_editing'
	}).appendTo(title_elemid);
	$('#title_editing').focus();
	var classname = keyword + "_info";
	document.getElementsByClassName(classname)[row_no+row_no+1].style.display = "none";
	classname = keyword + "_editbuttons";
	document.getElementsByClassName(classname)[row_no].style.display = "table-row";
};

function done_editing(keyword)
{
    var oldhours_value = hours_value;
	notes_value = $('#notes_editing').val();
	title_value = $('#title_editing').val();
	hours_value = $('#hours_editing').val();
    
    //update total hours
    var difference =  oldhours_value - hours_value;
    
    var totalhours = $(totalhours_elemid).text() - difference;
    
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