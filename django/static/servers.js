$(document).ready(function(){
    $('#svr-display-table').datagrid({
        url:'xxx.json',
        title:'服务器列表',
        fit:true,
        iconCls:'icon-filter',
        fitColumns:true,
//        nowrap:true,
//        sortName:"sum-servers",
//        sortOrder:"desc",
        rownumbers:true,
        collapsible:true,
        pagination:true,
        loadMsg:"加载中,请稍候...",
        singleSelect:true,
        striped:true,
        columns:[[
//            {field:'svr-id':title:'ID',with 5},
//            {field:'idc-id', title:'IDC-ID'},
//            {field:'user-id', title:'User-ID'},
//            {field:'svr-usable', title:'usable'},
            {field:'svr-name', title:'编号', width:40},
            {field:'idc-name', title:'所在机房', width:40},
            {field:'cab-name', title:'所属机柜', width:40},
            {field:'svr-size', title:'规格', width:20},
            {field:'svr-parts', title:'配置', width:40},
            {field:'storage-date', title:'入库日期', width:40},
            {field:'end-date', title:'到期日期', width:40},
            {field:'father-server', title:'父级', width:40},
            {field:'pro-name', title:'所属项目', width:40},
            {field:'op-name', title:'负责人', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-update').linkbutton('enable')
            $('#btn-del').linkbutton('enable')
        },
        onDblClickRow:open_update_window,
        toolbar:[{
            id:'btn-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                $('.parts-tip').tooltip({
                    position:'right',
                    content:'<span style="color: #000000">格式如下：<br>8核|8G-DDR3|160G-SSD</span> ',
                    onShow:function() {
                        $(this).tooltip('tip').css({
                            backgroundColor:'#ffe48d',
                            borderColor:'#666'
                        })
                    }
                })
                $('.size-tip').tooltip({
                    position:'right',
                    content:'<span style="color: #000000">合法内容包括：<br>xU<br>塔式<br>刀柜<br>刀片<br>虚拟机</span> ',
                    onShow:function() {
                        $(this).tooltip('tip').css({
                            backgroundColor:'#ffe48d',
                            borderColor:'#666'
                        })
                    }
                })
                $('.father-tip').tooltip({
                    position:'right',
                    content:'<span style="color: #000000">该服务器是否构建在其它服务器下，<br>如刀片机的父服务器为某个刀柜，<br>虚拟机的父服务器为某个物理机。<br>有则选选择有</span> ',
                    onShow:function() {
                        $(this).tooltip('tip').css({
                            backgroundColor:'#ffe48d',
                            borderColor:'#666'
                        })
                    }
                })
                $('#svr-add-new').dialog('open'),
                    $('#svr-admin').combobox({'url':'/resource/get-users/'}),
                    $('#svr-idc').combobox({'url':'/resource/get-idcs/'})
            }
        },{
            id:'btn-update',
            text:"更新",
            iconCls:'icon-edit',
            disabled:true,
            handler:open_update_window
        },'-',{
            id:'btn-del',
            text:'删除',
            iconCls:'icon-clear',
            disabled:true,
            handler:function(){
                $.messager.confirm('删除确认', '请确认需要删除该机房信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#svr-display-table').datagrid('getSelected')
                        if (val) {
                            var cid=val['svr-id']
                            $.post('/resource/del-cab/',
                                {'cid':cid},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#svr-display-table').datagrid('reload')
                                    } else {alert("删除失败，请重试!")}
                                })
                        }
                    }
                });
            }
        }]
    })
    var p = $('#svr-display-table').datagrid('getPager');
    $(p).pagination({
        pageSize:30,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })

})

function cb_add_server_commit() {
    $.post('/resource/add-cab/',
        $('#svr-add-form').serialize(),
        function(data, status) {
            if (status == 'success' && data['status']) {
                alert("添加成功!")
                parent.location.reload()
            } else {alert("添加失败，请重试!")}
        })
}

function cb_add_server_cancel() {
    $('#svr-add-new').dialog('close')
}

function open_update_window() {
    var val = $('#svr-display-table').datagrid('getSelected')
    if (val) {
        var uid=val['user-id']
        var iid=val['idc-id']
        var usable=val['svr-usable']
        $('#svr-id').attr('value', val['svr-id'])
        $('#svr-name').attr('value',val['svr-name'])
        $('#svr-size').attr('value',val['svr-size'])
        $('#svr-end-date').datebox('setValue',val['end-date'])
        $('#svr-update-usable').combobox({'url':'resource/usable/?ub=' + usable + '&cid=' + val['svr-id'], 'method':'get'})
        $('#svr-update-admin').combobox({'url':'/resource/get-users/?uid=' + uid, 'method':'get'})
        $('#svr-update-idc').combobox({'url':'/resource/get-idcs/?idcid=' + iid, 'method':'get'})
    }
    $('#svr-update-div').dialog('open')
}

function cb_update_commit() {
    $.post('/resource/update-cab/',
        $('#svr-update-form').serialize(),
        function(data, status) {
            if (status == 'success' && data['status'] == 'success') {alert('修改成功')}
            $('#svr-update-div').dialog('close')
            $('#svr-display-table').datagrid('reload')
        })
}

function cb_update_cancel() {
    $('#svr-update-div').dialog('close')
}

function check_father_selected() {
    if (!$('#svr-none-father').is(":checked")) {
        $('#svr-add-father').combobox('disable')
    } else {
        $('#svr-add-father').combobox('enable')
    }
}

function check_project_selected() {
    if (!$('#svr-none-project').is(":checked")) {
        $('#svr-add-project').combobox('disable')
    } else {$('#svr-add-project').combobox('enable')}
}

function check_update_father_selected() {
    if (!$('#svr-update-none-father').is(":checked")) {
        $('#svr-update-father').combobox('disable')
    } else {
        $('#svr-update-father').combobox('enable')
    }
}

function check_update_project_selected() {
    if (!$('#svr-update-none-project').is(":checked")) {
        $('#svr-update-project').combobox('disable')
    } else {$('#svr-update-project').combobox('enable')}
}























