$(document).ready(function() {
    $('#pro-main').datagrid({
//        url:'/project/list-projects/',
        title:'项目管理',
        url:'xx.json',
        iconCls:'icon-filter',
        fitColumns:true,
        rownumbers:true,
        collapsible:true,
        pagination:true,
        loadMsg:"加载中,请稍候...",
        singleSelect:true,
        striped:true,
        columns:[[
//            {field:'pro-id':title:'ID',with 5},
            {field:'pro-name', title:'名称', width:40},
            {field:'pro-description', title:'描述', width:40},
            {field:'pro-admin', title:'负责人', width:30},
            {field:'add-date', title:'创建日期', width:40},
            {field:'pro-repository', title:'仓库地址', width:40},
            {field:'pro-language', title:'开发语言', width:40},
            {field:'pro-environment', title:'运行环境', width:40},
            {field:'pro-servers', title:'运行服务器', width:30, align:'center'},
            {field:'pro-comment', title:'备注', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-update').linkbutton('enable');
            $('#btn-del').linkbutton('enable');
            $('#btn-relation').linkbutton('enable');
        },
        onDblClickRow:function () {
            open_update_view();
        },
        toolbar:[{
            id:'btn-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                $('#pro-id').attr('value', 0);
                $('#pro-add').window('open')
            }
        },{
            id:'btn-update',
            text:"更新",
            iconCls:'icon-edit',
            disabled:true,
            handler:function() {
                open_update_view();
            }
        },{
            id:'btn-del',
            text:'删除',
            iconCls:'icon-clear',
            disabled:true,
            handler:function(){
                $.messager.confirm('删除确认', '请确认需要删除该机房信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#pro-main').datagrid('getSelected')
                        if (val) {
                            var pid=val['pro-id']
                            $.post('/project/del-project/',
                                {'pri':pid},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#svr-display-table').datagrid('reload')
                                    } else {alert(data['data'])}
                                })
                        }
                    }
                });
            }
        }, '-', {
            id:'btn-relation',
            text:'查看运行服务器详情',
            disabled:true,
            iconCls:'icon-tip',
            handler:function() {
                open_pro_ip_rel()
            }
        }]
    })
    var p = $('#pro-main').datagrid('getPager');
    $(p).pagination({
        pageSize:10,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })
});

function open_update_view() {
    var val = $('#pro-main').datagrid('getSelected');
    if (val) {
        $('#pro-add').dialog({title:'修改项目信息'})
        $('#pro-id').attr('value', val['pro-id']);
        $('#pro-name').attr('value', val['pro-name']);
        $('#pro-description').val(val['pro-description']);
        $('#pro-admin').attr('value', val['pro-admin']);
        $('#pro-repository').attr('value', val['pro-repository']);
        $('#pro-language').attr('value', val['pro-language']);
        $('#pro-environment').val(val['pro-environment']);
        $('#pro-comment').val(val['pro-comment']);
        $('#pro-add').window('open')
    }
}

function do_submit() {
    var pro_id = $('#pro-id').val()
    if (pro_id == 0) {
        if ($('#pro-add-form').form('validate')) {
            $.post('/project/add-project/',
            $('#pro-add-form').serialize(),
            function(data, status) {
                if (status == 'success' && data['status'] == 'success') {
                    alert('添加成功')
                    $('#pro-add').window('close')
                    $('#pro-main').datagrid('reload')
                } else {alert('添加失败')}
            })
        } else {return false}
    } else {
        if ($('#pro-add-form').form('validate')) {
            $.post('/project/update-project/',
                $('#pro-add-form').serialize(),
                function(data, status) {
                    if (status == 'success' && data['status'] == 'success') {
                        alert('修改成功')
                        $('#pro-add').window('close')
                        $('#pro-main').datagrid('reload')
                    } else {alert('修改失败')}
                })
        } else {return false}
    }
}

function do_cancel(id) {
    $(id).window('close')
}

function open_pro_ip_rel() {
    $('#pro-ip-relation').dialog({
        title:$('#pro-main').datagrid('getSelected')['pro-name'] + ' -- 服务器详情',
        onBeforeClose:function() {$('#pro-main').datagrid('reload')}
    })
    $('#pro-ip-rel-list').datagrid({
//        url:'/project/list-projects/',
        queryParams:{
            'pro-id':$('#pro-main').datagrid('getSelected')['pro-id']
        },
        url:'xx.json',
        fit:true,
        resizable:true,
        iconCls:'icon-filter',
        fitColumns:true,
        rownumbers:true,
        collapsible:true,
        pagination:true,
        loadMsg:"加载中,请稍候...",
        singleSelect:true,
        striped:true,
        columns:[[
//            {field:'rel-id':title:'IP-ID',with 5},
            {field:'ip-name', title:'IP', width:40},
            {field:'idc-name', title:'所在机房', width:40},
            {field:'rel-comment', title:'备注', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-rel-del').linkbutton('enable');
            $('#btn-rel-clean').linkbutton('enable')
        },
        toolbar:[{
            id:'btn-rel-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                $('#pro-ip-add-id').attr('value',$('#pro-main').datagrid('getSelected')['pro-id'])
                $('#pro-ip-add').window('open')
            }
        },'-',{
            id:'btn-rel-del',
            text:'删除',
            iconCls:'icon-clear',
            disabled:true,
            handler:function(){
                $.messager.confirm('删除确认', '请确认需要删除该机房信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#pro-ip-rel-list').datagrid('getSelected')
                        if (val) {
                            $.post('/project/del-pro-ip-relation/',
                                {'rel-id':val['rel-id'],  'del-type' : '0'},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#pro-ip-rel-list').datagrid('reload')
                                    } else {alert(data['data'])}
                                })
                        }
                    }
                });
            }
        },'-',{
            id:'btn-rel-clean',
            text:'清空',
            iconCls:'icon-cancel',
            disabled:true,
            handler:function(){
                $.messager.confirm('清空确认', '请确认需要清空该项目所有服务器信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#pro-ip-rel-list').datagrid('getSelected')
                        if (val) {
                            $.post('/project/del-pro-ip-relation/',
                                {'rel-id':val['rel-id'], 'del-type' : '1'},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#pro-ip-rel-list').datagrid('reload')
                                    } else {alert(data['data'])}
                                })
                        }
                    }
                });
            }
        }]
    })

    var p = $('#pro-ip-rel-list').datagrid('getPager');
    $(p).pagination({
        pageSize:10,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })
    $('#pro-ip-relation').window('open')
    $('#pro-ip-add-idc').combobox({url:'/resource/get-idcs/'})
}

function get_server() {
    $('#pro-ip-server').combobox({
        url:'/resource/get-ips/?ip-type=' + $('#pro-ip-add-ip-type').val() + "&idc=" + $('#pro-ip-add-idc').combobox('getValue') + '&status=2',
        method:'get'
    })
}

function do_rel_submit() {
    $.post('/project/add-pro-ip-relation/',
    $('#pro-ip-form').serialize(),
    function(data, status){
        if (status == 'success' && data['status'] == 'success') {
            alert('添加成功')
            $('#pro-ip-add').window('close')
            $('#pro-ip-rel-list').datagrid('reload')
        } else {alert('添加失败')}
    })
}

