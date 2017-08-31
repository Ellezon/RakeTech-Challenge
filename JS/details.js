var task_id = null;
var notes_elemid = null;
var title_elemid = null;
var hours_elemid = null;
var editing = false;
var notes_value = null;
var title_value = null;
var hours_value = null;

function show_info(table, id, rowno)
{    if(!editing)    
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
     $(notes_elemid).html("Notes: "+ notes_value);
    $(title_elemid).html(title_value);
    $(hours_elemid).html(hours_value);
    stop_editing(keyword);
}

function stop_editing(keyword)
{
    var classname = keyword + "_info";
   document.getElementsByClassName(classname)[1].style.display = "table-row";
   document.getElementsByClassName(classname)[1].style.display = "table-row";
    
    classname = keyword + "_editbuttons";

    document.getElementsByClassName(classname)[0].style.display = "none";
    document.getElementsByClassName(classname)[0].style.display = "none";
    editing = false;
}
function edit_task(id, keyword, rowno)
{
	notes_elemid = "#" + keyword + "_notes_" + rowno;
    title_elemid = "#" + keyword + "_title_" + rowno;
    hours_elemid = "#" + keyword + "_hours_" + rowno;
    //edit_id = "#" +keyword + "_edit";
    
	task_id = id;
	notes_value = $(notes_elemid).text();
	title_value = $(title_elemid).text();
    hours_value = $(hours_elemid).text();
    
    //prevent 'Notes:' from displaying
	notes_value  = notes_value .split(": ");
	notes_value  = notes_value [1];
    
	$(notes_elemid).html('');
	$('<input></input>').attr(
	{
		'value': notes_value ,
		'type': 'text',
		'id': 'notes_editing'
	}).appendTo(notes_elemid);
    console.log(editing);
    
    $(hours_elemid).html('');
	$('<input></input>').attr(
	{
		'value': hours_value ,
        'size' : '2',
		'type': 'text',
		'id': 'hours_editing'
	}).appendTo(hours_elemid);
    
    editing = true;
   	$(title_elemid).html('');
	$('<input></input>').attr(
	{
		'value': title_value ,
        'size' : '5',
		'type': 'text',
		'id': 'title_editing'
	}).appendTo(title_elemid);
	$('#title_editing').focus();
    
   var classname = keyword + "_info";
   document.getElementsByClassName(classname)[1].style.display = "none";
   document.getElementsByClassName(classname)[1].style.display = "none";
    
    classname = keyword + "_editbuttons";

    document.getElementsByClassName(classname)[0].style.display = "table-row";
    document.getElementsByClassName(classname)[0].style.display = "table-row";   
   	

};

function done_editing(keyword)
{
    notes_value = $('#notes_editing').val();
    title_value = $('#title_editing').val();
    hours_value = $('#hours_editing').val();
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
            'edit_hours' : hours_value                        
		},
		url: '../DB/DB_fns.php',
		method: 'POST'
   });
	//clear global vars
			task_id = null;
			notes_elemid = null;
            title_elemid = null;
            hours_elemid = null;
            notes_value = null;
            title_value = null;
            hours_value = null;


    stop_editing(keyword);
 };



function close_dialogue(delete_id)
{
	$(delete_id).dialog("destroy");
};