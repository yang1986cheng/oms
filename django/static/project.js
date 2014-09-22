$(document).ready(function() {
    $('#pro-main').datagrid({
        url:'xxx.json',
        title:'项目列表',
//        fit:true,
        iconCls:'icon-filter',
        fitColumns:true,

        rownumbers:true,
        collapsible:true,
        pagination:true,
        loadMsg:"加载中,请稍候...",
        singleSelect:true,
        striped:true,
        columns:[[
//            {field:'svr-id':title:'ID',with 5},
//            {field:'cab-id', title:'CAB-ID'},
//            {field:'admin-id', title:'User-ID'},
//            {field:'svr-used-type', title:'usable'},
//            {field:'idc-id', title:'iid'},
//            {field:'father-id', title:'fid'},
            {field:'svr-name', title:'编号', width:40},
            {field:'idc-name', title:'所在机房', width:40},
            {field:'cab-name', title:'所属机柜', width:40},
            {field:'svr-size', title:'规格', width:20},
            {field:'svr-parts', title:'配置', width:60},
            {field:'svr-os', title:'操作系统', width:40},
            {field:'storage-date', title:'入库日期', width:40},
            {field:'end-date', title:'到期日期', width:40},
            {field:'svr-father', title:'父级', width:40},
            {field:'svr-usable', title:'类型', width:20},
            {field:'admin-name', title:'负责人', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-update').linkbutton('enable')
            $('#btn-del').linkbutton('enable')
        },
        onDblClickRow:function () {
            parts_tip()
            size_tip()
            father_tip()
            open_update_window()
        },
        toolbar:[{
            id:'btn-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                parts_tip()
                size_tip()
                father_tip()
                $('#svr-add-new').dialog('open'),
                    $('#svr-admin').combobox({'url':'/resource/get-users/'}),
                    $('#svr-add-idc').combobox({'url':'/resource/get-idcs/'})
            }
        },{
            id:'btn-update',
            text:"更新",
            iconCls:'icon-edit',
            disabled:true,
            handler:function() {
                parts_tip()
                size_tip()
                father_tip()
                open_update_window()
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
})