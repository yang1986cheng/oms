$(document).ready(function(){
    $("p").click(function(){
        $(this).load('http://127.0.0.1:8000/exec/')
        $(this).load('http://127.0.0.1:8000/static/status')
        $(this).css("background-color","red")
        $(this).hide(1000)
    })
})