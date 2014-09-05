$(document).ready(function() {
    $("input.deploy").removeAttr("disabled");
    $("input.deploy").click(function() {
        var self=this
        $("input.cancel").hide()
        $(this).val("deploying...").width(150).attr('disabled',"true").addClass('deploying');
        $.post("/deployment/deploy-php/",
            $('#deploy-form').serialize(),
            function(data, status) {
                $("textarea.result").val(data);
                $(self).val("Done !").width(150).removeClass('deploying');
            })
    })

    $("input.cancel").click(function() {
        parent.location.reload();
    })

    $("#project").change(function() {
        var val = $(this).children("option:selected").val();
        if(val == "none") {alert("请选择正确的项目!");return;}
        $.post("/functions/logs/",
            {"project" : val, "action" : "getlist"},
            function(data, status) {
                $("#logs").empty();
                for (var i = 0; i < data.length; i++) {
                    s = data[i]
                    $("#logs").append("<option value = " + s + ">" + s + "</option>");
                }
            })
    })

    $("#check").click(function() {
        var type = $('input:radio:checked').val()
        var log = $("#logs").children("option:selected").val()
        var project = $("#project").children("option:selected").val();
        $("textarea.displaywindow").val("爷在撸力的工作中,请稍后........\n");
        if (log == "none") {alert("请选择日志");return}
        if (type == 'dumps') {
            $.post("/functions/logs/",
                {"project" : project, "action" : "getcontent", "filename" : log, "viewtype" : type},
                function(data, status) {
                    $("textarea.displaywindow").val(data);
                })
            return;
        }
        if (type == 'realtime') {
            $.post("/functions/logs/",
                {"project" : project, "action" : "getcontent", "filename" : log, "viewtype" : type, "wor" : 'w'},
                function(data, status) {
                    $("textarea.displaywindow").val(data);
                })
            return;
        }
    })

    $(function() {
        var timer = 6000;
        var interval;
        function run() {
            interval = setInterval(get, timer);
        }
        $("#check").click(function() {
            run();
        })
        function get() {
            var type = $('input:radio:checked').val()
            var log = $("#logs").children("option:selected").val()
            var project = $("#project").children("option:selected").val();
            if (log == "none") {alert("请选择日志");return}
            if (type == 'realtime') {
                $.post("/functions/logs/",
                    {"project" : project, "action" : "getcontent", "filename" : log, "viewtype" : type, "wor" : 'r'},
                    function(data, status) {
                        var str =  $("textarea.displaywindow").val() + data;
                        $("textarea.displaywindow").val(str)
                    })
                return;
            }
        }
    })
})

function cancel_login() {
    $('#login_form').form('clear')
}