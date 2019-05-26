let $ = require("jquery");

$("#start-btn").click(function() {
    $(".menu-screen").css('display', 'none');
    $("#canvas").css('display', 'block');
    require("../renderer.js");
});