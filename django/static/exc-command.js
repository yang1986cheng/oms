$(document).ready(function(){
    $('#exc-type').combo({
        required:true,
        multiple:false,
        editable:false,
        width:120
    })
    $('#sp').appendTo($('#exc-type').combo('panel'));
    $('#sp input').click(function(){
        var v = $(this).val();
        var s = $(this).next('span').text();
        $('#exc-type').combo('setValue', v).combo('setText', s).combo('hidePanel');
    });
})