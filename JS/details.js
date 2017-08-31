
 function get_info(table, id, rowno){
    var classname = table+"_notes";
  if(document.getElementsByClassName(classname)[rowno].style.display == "table-row" )
  {
    document.getElementsByClassName(classname)[rowno].style.display = "none"; 
  } else {
        document.getElementsByClassName(classname)[rowno].style.display = "table-row"; 
      
    }
    
  };
    
   