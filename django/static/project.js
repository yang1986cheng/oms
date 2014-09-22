$(document).ready(function() {
    $('#pro-main').datagrid({
        url:'xx.json',
        title:'项目列表',
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
            {field:'pro-repository', title:'仓库', width:40},
            {field:'pro-language', title:'开发语言', width:40},
            {field:'pro-environment', title:'运行环境', width:40},
            {field:'pro-comment', title:'备注', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-update').linkbutton('enable');
            $('#btn-del').linkbutton('enable');
        },
        onDblClickRow:function () {
            open_update_view();
        },
        toolbar:[{
            id:'btn-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
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
                            var sid=val['svr-id']
                            $.post('/resource/del-server/',
                                {'sid':sid},
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
        alert(0)
    } else {
        if ($('#pro-add-form').form('validate')) {
            alert("ok")
        } else {
            alert('no')
        }
    }
}

function do_cancel() {
    $('#pro-add').window('close')
}