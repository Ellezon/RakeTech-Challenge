
 function show_info(table, id, rowno){
    var classname = table+"_notes";    
  if(document.getElementsByClassName(classname)[rowno+rowno].style.display == "table-row" )  
  {
    document.getElementsByClassName(classname)[rowno+rowno].style.display = "none"; 
    document.getElementsByClassName(classname)[rowno+rowno+1].style.display = "none";     
  } else {
        document.getElementsByClassName(classname)[rowno+rowno].style.display = "table-row"; 
        document.getElementsByClassName(classname)[rowno+rowno+1].style.display = "table-row";         
      
    }
    
  };
  
  function open_dialogue(id,delete_id, keyword){
    
    var idname = "#"+keyword+"_yes";    
    console.log(idname);
            $(delete_id).dialog({
             minHeight: 30
                });
             $(idname).click(function(){ 
                //send task ID to PHP to delete task from DB
                console.log(id);
                $.ajax({
                data: 'del_id=' + id,
                url: '../DB/DB_fns.php',
                method: 'GET', // or GET
                success: function(msg) {
                   location.reload();
                }
});
})
            
 }; 
 
 
   function close_dialogue(delete_id){
  
            $(delete_id).dialog("destroy");

            
 };   
   
   
         
 
 
 
    
   