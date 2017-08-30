<?php
    define("TITLE", "Organiser");
    include('DB/DB_fns.php');
    include ('HTML/header.html');
    $tasks = get_tasks();
    define("tasks",$tasks);
    include ('HTML/index.html');
    include ('HTML/footer.html');
?>

