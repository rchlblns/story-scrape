$(document).ready(function(){

    $(".button-collapse").sideNav();
    
    // Grab the articles as a JSON
    $.getJSON("/articles", function(data){
        // Iterates through all the articles
        for (var i = 0; i < data.legth; i++) {
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        }
    });
    
    
});