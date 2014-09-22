$(document).ready(function(){
    $('#ip-private-table').datagrid({
        queryParams:{'ip-type':'0'},
        url:'/resource/get-ips/',
        height:500,
        fit:true,
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
//            {field:'idc-id', title:'IDC-ID'},
//            {field:'status-id', title:'utid'},
//            {field:'pro-id', title:'pro-id'},
//            {field:'used-for-id', title:'used-for'},
//            {field:'ip-id', title:'IP_ID'},
            {field:'ip-name', title:'IP', width:60},
            {field:'idc-name', title:'所在机房', width:40},
            {field:'svr-name', title:'分配服务器', width:50},
//            {field:'pro-name', title:'所属项目', width:40},
//            {field:'used-for', title:'用途', width:40},
            {field:'status', title:'状态', width:20},
            {field:'ip-comment', title:'备注', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-update').linkbutton('enable')
            $('#btn-del').linkbutton('enable')
        },
        onDblClickRow:function () {
            open_update_window('#ip-private-update','#ip-private-table')
        },
        toolbar:[{
            id:'btn-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                $.messager.defaults={ok:'单个IP', cancel:'IP段'}
                $.messager.confirm('选择添加类型','<br>添加单个IP、添加IP段',function(r) {
                    if (r) {
                        $('#ip-add').dialog({title:'添加单个IP'})
                        $('#ip-add-start').html('IP地址：')
                        $('#add-type').attr('value', '0')
                        $('#ip-type').attr('value', '0')
                        $('#ip-add').dialog('open')
                        $('#ip-add').dialog('center')
                        $('#ip-to').hide()
                    }
                    else {
                        $('#ip-add').dialog({title:'批量添加IP'})
                        $('#ip-add-start').html('IP范围：')
                        $('#add-type').attr('value', '1')
                        $('#ip-type').attr('value', '0')
                        $('#ip-add').dialog('open')
                        $('#ip-add').dialog('center')
                        $('#ip-to').show()
                    }
                })
                $('#ip-add-idc').combobox({url:'/resource/get-idcs/'})
            }
        },{
            id:'btn-update',
            text:"更新",
            iconCls:'icon-edit',
            disabled:true,
            handler:function() {
                open_update_window('#ip-private-update','#ip-private-table')
            }
        },'-',{
            id:'btn-del',
            text:'删除',
            iconCls:'icon-clear',
            disabled:true,
            handler:function(){
                $.messager.confirm('删除确认', '请确认需要删除该IP信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#ip-private-table').datagrid('getSelected')
                        if (val) {
                            var cid=val['ip-id']
                            $.post('/resource/del-ip/',
                                {'ipid':cid},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#ip-private-table').datagrid('reload')
                                    } else {alert("删除失败，请重试!")}
                                })
                        }
                    }
                })
            }
        }]
    })
    var p = $('#ip-private-table').datagrid('getPager');
    $(p).pagination({
        pageSize:10,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })

    $('#ip-div-main').tabs({
        onSelect:function(title) {
            if (title == '公网') {
                open_public_table()
                return
            }
            if (title == '映射关系') {
                open_relation_div()
                return
            }
        }
    })
})

function open_relation_div() {
    $('#ip-relation').datagrid({
        url:'/resource/get-ip-relation/',
        height:500,
        fit:true,
        iconCls:'icon-filter',
        fitColumns:true,
        rownumbers:true,
        collapsible:true,
        pagination:true,
        loadMsg:"加载中,请稍候...",
        singleSelect:true,
        striped:true,
        columns:[[
//            {field:'relation-id':title:'rid',with 5},
//            {field:'pub-ip-id':title:'pubid',with 5},
//          {field:'pri-ip-id':title:'priid',with 5},
//          {field:'idc-id':title:'idcid',with 5},
            {field:'pub-name', title:'公网IP', width:60},
            {field:'pub-port', title:'端口', width:20},
            {field:'pri-name', title:'私网IP', width:60},
            {field:'pri-port', title:'端口', width:20},
            {field:'ip-comment', title:'备注', width:70}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-relation-update').linkbutton('enable')
            $('#btn-relation-del').linkbutton('enable')
        },
        onDblClickRow:function () {
            open_relation_update_view()
        },
        toolbar:[{
            id:'btn-relation-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                var a = 'ip-type'
                $('#ip-relation-add-idc').combobox({
                    url : '/resource/get-idcs/',
                    onSelect:function(record) {
                        $('#ip-relation-add-pub').combobox({
                            url:'/resource/get-ips/?ip-type=1&idc=' + record.id,
                            method:'get'
                        })
                        $('#ip-relation-add-pri').combobox({
                            url:'/resource/get-ips/?ip-type=0&idc=' + record.id,
                            method:'get'
                        })
                    }
                })
                $('#ip-relation-add').dialog('open')
                $('#ip-relation-add').dialog('center')
            }
        },{
            id:'btn-relation-update',
            text:"更新",
            iconCls:'icon-edit',
            disabled:true,
            handler:function() {
                open_relation_update_view()
            }
        },'-',{
            id:'btn-relation-del',
            text:'删除',
            iconCls:'icon-clear',
            disabled:true,
            handler:function(){
                $.messager.confirm('删除确认', '请确认需要删除该IP信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#ip-relation').datagrid('getSelected')
                        if (val) {
                            var cid=val['relation-id']
                            $.post('/resource/del-ip-relation/',
                                {'rel-id':cid},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#ip-relation').datagrid('reload')
                                    } else {alert("删除失败，请重试!")}
                                })
                        }
                    }
                })
            }
        }]
    })
    var p = $('#ip-relation').datagrid('getPager');
    $(p).pagination({
        pageSize:10,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })
}

function open_relation_update_view() {
    var val = $('#ip-relation').datagrid('getSelected')
    if (val) {
        $('#ip-pub-id').attr('value', val['pub-ip-id'])
        $('#ip-pri-id').attr('value', val['pri-ip-id'])
        $('#ip-relation-id').attr('value', val['relation-id'])
        $('#ip-relation-update-pub-port').numberbox('setValue', val['pub-port'])
        $('#ip-relation-update-pri-port').numberbox('setValue', val['pri-port'])
        $('#ip-relation-update-comment').val(val['ip-comment'])
        $('#ip-relation-update-pub').combobox({
            url:'/resource/get-ips/?ip-type=1&priid=' + val['pub-ip-id'] + '&idc=' + val['idc-id']
        })
        $('#ip-relation-update-pri').combobox({
            url:'/resource/get-ips/?ip-type=0&priid=' + val['pri-ip-id'] + '&idc=' + val['idc-id']
        })
    }
    $('#ip-relation-update').dialog('open')
    $('#ip-relation-update').dialog('center')
}

function open_public_table() {
    $('#ip-public-table').datagrid({
        queryParams:{'ip-type':'1'},
        url:'/resource/get-ips/',
//        url:'xxx.json',
        height:500,
//        title:'服务器列表',
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
//            {field:'ip-private-id', title:'IP_ID'},
//            {field:'ip-public-id', title:'IP_ID'},
            {field:'ip-name', title:'IP', width:60},
            {field:'idc-name', title:'所在机房', width:40},
            {field:'svr-name', title:'分配服务器', width:50},
//            {field:'pro-name', title:'所属项目', width:40},
//            {field:'used-for', title:'用途', width:40},
            {field:'status', title:'状态', width:40},
            {field:'ip-comment', title:'备注', width:40}
        ]],
        onSelect:function(rowIndex, rowData) {
            $('#btn-update-pub').linkbutton('enable')
            $('#btn-del-pub').linkbutton('enable')
        },
        onDblClickRow:function () {
            open_update_window('#ip-private-update','#ip-public-table')
        },
        toolbar:[{
            id:'btn-add',
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                $.messager.defaults={ok:'单个IP', cancel:'IP段'}
                $.messager.confirm('选择添加类型','<br>添加单个IP、添加IP段',function(r) {
                    if (r) {
                        $('#ip-add').dialog({title:'添加单个IP'})
                        $('#ip-add-start').html('IP地址：')
                        $('#add-type').attr('value', '0')
                        $('#ip-type').attr('value', '1')
                        $('#ip-add').dialog('open')
                        $('#ip-add').dialog('center')
                        $('#ip-to').hide()
                    }
                    else {
                        $('#ip-add').dialog({title:'批量添加IP'})
                        $('#ip-add-start').html('IP范围：')
                        $('#add-type').attr('value', '1')
                        $('#ip-type').attr('value', '1')
                        $('#ip-add').dialog('open')
                        $('#ip-add').dialog('center')
                        $('#ip-to').show()
                    }
                })
                $('#ip-add-idc').combobox({url:'/resource/get-idcs/'})
            }
        },{
            id:'btn-update-pub',
            text:"更新",
            iconCls:'icon-edit',
            disabled:true,
            handler:function() {
                open_update_window('#ip-private-update','#ip-public-table')
            }
        },'-',{
            id:'btn-del-pub',
            text:'删除',
            iconCls:'icon-clear',
            disabled:true,
            handler:function(){
                $.messager.confirm('删除确认', '请确认需要删除该IP信息!<br><br>该操作将不可撤销!', function(r){
                    if (r){
                        var val = $('#ip-public-table').datagrid('getSelected')
                        if (val) {
                            var cid=val['ip-id']
                            $.post('/resource/del-ip/',
                                {'ipid':cid},
                                function(data, status) {
                                    if(status == 'success' && data['status'] == 'success') {
                                        alert("删除成功!")
                                        $('#ip-public-table').datagrid('reload')
                                    } else {alert("删除失败，请重试!")}
                                })
                        }
                    }
                })
            }
        }]
    })
    var p = $('#ip-public-table').datagrid('getPager');
    $(p).pagination({
        pageSize:10,
        pageList:[10,30,50,100],
        beforePageText:'第',
        afterPageText:'页 共 {pages} 页',
        displayMsg:'当前显示 {from} - {to} 条记录   共 {total} 条记录'
    })
}
function ip_add_submit() {
    if ($('#ip-add-form').form('validate')) {
        var ip1_s=parseInt($('#ip-addr1-s').val())
        var ip2_s=parseInt($('#ip-addr2-s').val())
        var ip3_s=parseInt($('#ip-addr3-s').val())
        var ip4_s=parseInt($('#ip-addr4-s').val())

        var ip1_e=parseInt($('#ip-addr1-e').val())


        var nmask1=parseInt($('#netmask-1').val())
        var nmask2=parseInt($('#netmask-2').val())
        var nmask3=parseInt($('#netmask-3').val())
        var nmask4=parseInt($('#netmask-4').val())

        $.each(function(i){
            if (i < 0 || i > 255) {
                alert("请正确填写IP信息!")
                return
            }
        })(ip1_s,ip2_s,ip3_s,ip4_s,ip1_e,nmask1,nmask2,nmask3,nmask4)

        var ip_from=[ip1_s,ip2_s,ip3_s,ip4_s].join('.')
        var ip_end=ip1_e
        var nmask=[nmask1,nmask2,nmask3,nmask4].join('.')
        var add_idc = $('#ip-add-idc').combobox('getValue')
        var add_type = $('#add-type').val()
        var ip_type = $('#ip-type').val()

        $.post('/resource/add-ips/',
            {"ip-from":ip_from,"ip-end":ip_end,"netmask":nmask,"add-idc":add_idc, "add-type" : add_type, "ip-type" :ip_type},
            function(data, status) {
                if (status == 'success' && data['status']) {
                    alert("添加成功!")
                    $('#ip-add').dialog('close')
                    $('#ip-private-table').datagrid('reload')
                    $('#ip-public-table').datagrid('reload')
                } else {alert("添加失败，请重试!")}
            })
    } else {
        alert("请正确填写信息!")
    }
}

function ip_add_cancel() {
    $('#ip-add').dialog('close')
}

function open_update_window(upid,tableid) {
    var v = $(tableid).datagrid('getSelected')
    if (v) {
        if (v['status'] == '不可用') {
            $.messager.confirm('启用提示', '该IP为禁用状态<br><br>是否现在启用', function(r){
                if (r) {
                    $.post('/resource/update-ip/',
                        {"status" : '0', "up-ip-id" : v['ip-id'], "ip-up-comment" : v['ip-comment']},
                        function(data, status) {
                            if (status == 'success' && data['status'] == 'success') {
                                alert('修改成功')
                                $('#ip-private-update').dialog('close')
                                $('#ip-private-table').datagrid('reload')
                                $('#ip-public-table').datagrid('reload')
                                return
                            } else {
                                alert('修改失败，请重试!')
                                return
                            }
                        })
                }
                else {return}
            })
            return
        } else {
            $('#ip-up-addr').attr('value', v['ip-name'])
            $('#ip-up-addr-id').attr('value',v['ip-id'])
            $('#ip-up-comment').val(v['ip-comment'])
            $('#ip-up-svr').combobox({
                onBeforeLoad:function(param) {
                    param.idc = v['idc-id']
                    param.serid = v['svr-id']
                },
                url:'/resource/get-servers/'
            })
        }
        $(upid).dialog('open')
    }
}

function ip_update_submit() {
    $.post('/resource/update-ip/',
        $('#ip-up-form').serialize(),
        function(data, status) {
            if (status == 'success' && data['status'] == 'success') {
                alert('修改成功')
                $('#ip-private-update').dialog('close')
                $('#ip-private-table').datagrid('reload')
                $('#ip-public-table').datagrid('reload')
            } else {alert('修改失败，请重试!')}
        })
}

function ip_update_cancel() {
    $('#ip-private-update').dialog('close')
}

function ip_update_disable() {
    $.post('/resource/update-ip/',
        {"status" : '1', "up-ip-id" : $('#ip-up-addr-id').val(), "ip-up-comment" : $('#ip-up-comment').val()},
        function(data, status) {
            if (status == 'success' && data['status'] == 'success') {
                alert('成功禁用该IP！')
                $('#ip-private-update').dialog('close')
                $('#ip-private-table').datagrid('reload')
                $('#ip-public-table').datagrid('reload')
            }
        })
}

function ip_relation_add_submit() {
    if ($('#ip-relation-add-form').form('validate')) {
        $.post('/resource/add-ip-relation/',
            $('#ip-relation-add-form').serialize(),
            function(data,status) {
                if (status == 'success' && data['status'] == 'success') {
                    alert('添加成功')
                    $('#ip-relation-add').dialog('close')
                    $('#ip-relation').datagrid('reload')
                } else {alert(data['data'])}
            }
        )
    }
}

function ip_relation_update_submit() {
    if ($('#ip-relation-update-form').form('validate')) {
        $.post('/resource/update-ip-relation/',
            $('#ip-relation-update-form').serialize(),
            function(data,status) {
                if (status == 'success' && data['status'] == 'success') {
                    alert('修改成功')
                    $('#ip-relation-update').dialog('close')
                    $('#ip-relation').datagrid('reload')
                } else {alert('修改失败，请重试!')}
            }
        )
    }
}

function ip_cancel(id) {
    $(id).dialog('close')
}





















