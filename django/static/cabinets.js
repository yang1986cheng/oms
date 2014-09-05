$(document).ready(function(){
    $('#cb-display-table').datagrid({
        url:'xx.json',
        title:'机柜列表',
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
//            {field:'cb-id':title:'ID',with 5},
//            {field:'idc-id', title:'IDC-ID'},
//            {field:'user-id', title:'User-ID'},
//            {field:'cb-usable', title:'usable'},
            {field:'cb-name', title:'名称', width:40},
            {field:'idc-name', title:'所在机房', width:40},
            {field:'cb-size', title:'规格', width:40},
            {field:'storage-date', title:'入库日期', width:40},
            {field:'end-date', title:'到期日期', width:40},
            {field:'sum-servers', title:'机器数', width:15, align:"right", sortable:true,sorter:function(a,b){return (a>b?1:-1);}},
            {field:'is-full', title:'空位', width:10},
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
                $('#cb-add-new').dialog('open'),
                $('#cb-admin').combobox({'url':'/resource/get-users/'}),
                $('#cb-idc').combobox({'url':'/resource/get-idcs/'})
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
                        var val = $('#cb-display-table').datagrid('getSelected')
                        if (val) {
                            var cid=val['cb-id']
                            $.post('/resource/del-cab/',
                                {'cid':cid},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#cb-display-table').datagrid('reload')
                                    } else {alert("删除失败，请重试!")}
                                })
                        }
                    }
                });
            }
        }]
    })
    var p = $('#cb-display-table').datagrid('getPager');
    $(p).pagination({
        pageSize:30,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })

})

function cb_add_commit() {
    $.post('/resource/add-cab/',
        $('#cb-add-form').serialize(),
        function(data, status) {
            if (status == 'success' && data['status']) {
                alert("添加成功!")
                parent.location.reload()
            } else {alert("添加失败，请重试!")}
        })
}

function cb_add_cancel() {
    $('#cb-add-new').dialog('close')
}

function open_update_window() {
        var val = $('#cb-display-table').datagrid('getSelected')
        if (val) {
            var uid=val['user-id']
            var iid=val['idc-id']
            var usable=val['cb-usable']
            $('#cb-id').attr('value', val['cb-id'])
            $('#cb-name').attr('value',val['cb-name'])
            $('#cb-size').attr('value',val['cb-size'])
            $('#cb-end-date').datebox('setValue',val['end-date'])
            $('#cb-update-usable').combobox({'url':'resource/usable/?ub=' + usable + '&cid=' + val['cb-id'], 'method':'get'})
            $('#cb-update-admin').combobox({'url':'/resource/get-users/?uid=' + uid, 'method':'get'})
            $('#cb-update-idc').combobox({'url':'/resource/get-idcs/?idcid=' + iid, 'method':'get'})
        }
        $('#cb-update-div').dialog('open')
}

function cb_update_commit() {
    $.post('/resource/update-cab/',
    $('#cb-update-form').serialize(),
    function(data, status) {
        if (status == 'success' && data['status'] == 'success') {alert('修改成功')}
        $('#cb-update-div').dialog('close')
        $('#cb-display-table').datagrid('reload')
    })
}

function cb_update_cancel() {
    $('#cb-update-div').dialog('close')
}























