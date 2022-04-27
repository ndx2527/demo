var stuData = []; // 全局存放学生列表数据
var editId = null; // 全局存储要修改的学生 id

var curPage = 1; // 表示当前页码，默认进来是第一页
var pageNum = null; // 总页数，暂时为 null，之后会根据数据动态的进行计算

// 类似于原生 js 中的 window.onload
// 在这个方法里面，我们可以书写一些初始化的代码
$(function(){
    // 左侧菜单栏绑定事件
    changeItem();
    // 初始化的渲染数据，从本地 localStorage 获取数据
    if(localStorage.stuData){
        // 说明本地有数据，直接从本地获取数据
        stuData = JSON.parse(localStorage.stuData);
    } else {
        // 说明本地没有数据，需要初始化数据
        initData();
    }
    // 接下来在这个地方，我们需要计算总页码数
    // 假设 45 条数据，应该是 5 页，所以应该是向上取整
    pageNum = Math.ceil(stuData.length / 10);
    // 第 1 页：1 - 10（对应数组下标：0 - 9）
    // 第 2 页：11 - 20（对应数组下标：10 - 19）
    // 数组总长度.slice((当前页码数 - 1) * 10， 当前页码数 * 10)
    // 第 1 页：stuData.slice(0, 10)
    // 第 2 页：stuData.slice(10, 20)
    renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
    renderPageSelect(pageNum);
})

// 跳转到学生列表
function goToStuList(){
    $('.leftMenuItem').eq(0).addClass('itemActive');
    $('.leftMenuItem').eq(1).removeClass('itemActive');
    $('.rightContent>div').eq(0).removeClass('notShow');
    $('.rightContent>div').eq(1).addClass('notShow');
}

// 跳转到新增学生
function goToAddStu(id){
    if(id){
        // 有 id 传递过来，说明是要修改学生
        // 将这个 id 传递给服务器，服务器返回对应该 id 的学生
        $.ajax({
            url : '/getOneStuInfo/',
            type : 'POST',
            dataType : 'json',
            data : { id },
            success : function(res){
                // 已经从服务器拿到了对应的学生数据，接下来我们需要回填表单
                $('#stuName').val(res.stuName);
                $('#stuEmail').val(res.stuEmail);
                $('#stuAge').val(res.stuAge);
                $('#stuTel').val(res.stuTel);
                $('#stuAddr').val(res.stuAddr);
                if(res.stuGender == '男'){
                    $('#male').prop('checked', true);
                    $('#female').prop('checked', false);
                } else {
                    $('#male').prop('checked', false);
                    $('#female').prop('checked', true);
                }
                editId = res.stuId;
                $('#addStuBtn').val('确认修改');
            }
        })
    }
    $('.leftMenuItem').eq(0).removeClass('itemActive');
    $('.leftMenuItem').eq(1).addClass('itemActive');
    $('.rightContent>div').eq(0).addClass('notShow');
    $('.rightContent>div').eq(1).removeClass('notShow');
}

// 左侧侧边栏的切换事件
function changeItem(){
    $('.leftMenu').on('click','.leftMenuItem',function(e){
        if($(e.target).html() == '学生列表'){
            // 说明用户点击的是学生列表
            goToStuList();
        } else {
            // 说明学生点击的是新增学生
            goToAddStu();
        }
    })
}

// 渲染表格的方法
function renderTable(arr){
    let tHead = `
        <thead>
            <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>邮箱</th>
                <th>年龄</th>
                <th>手机号</th>
                <th>住址</th>
                <th>操作</th>
            </tr>
        </thead>
    `;
    let tBody = arr.map(item=>{
        return `
            <tr>
                <td>${item.stuId}</td>
                <td>${item.stuName}</td>
                <td>${item.stuGender}</td>
                <td>${item.stuEmail}</td>
                <td>${item.stuAge}</td>
                <td>${item.stuTel}</td>
                <td>${item.stuAddr}</td>
                <td>
                <button type="button" data-id="${item.stuId}" class="operationBtn editBtn">编辑</button>
                <button type="button" data-id="${item.stuId}" class="operationBtn delBtn">删除</button>
                </td>
            </tr>
        `
    }).join('');
    $('#stuTable').html(tHead + '<tBody>' + tBody + '</tBody>');
    // 在 jquery 中，取赋值同体(同一个方法)
    // 原生 js 取值一个方法，赋值一个方法
    // obj.getAttrbute('id') obj.setAttrbute('id','test')
    // $(obj).attr('id') $(obj).attr('id','test')
    // $('#stuTable').html()
    // $('#stuTable').html(<tr><td>123</td></tr>)
    // tBody 确实是一个数组，但是当一个数组和字符串想加的时候，数组也会被转为字符串
}


// 获取初始数据的方法
function initData(){
    $.ajax({
        url : '/getStuData/',
        type : 'GET',
        dataType : 'json',
        success : function({data}){
            localStorage.stuData = JSON.stringify(data); // 本地存一份
            stuData = data;
            renderTable(stuData);
        }
    })
}

// 随机生成一条数据
$('#addStuRandom').click(function(){
    // 发送 ajax 请求
    $.ajax({
        url : '/addStuRandom/',
        type : 'GET',
        dataType : 'json',
        success : function(res){
            stuData.push(res);
            localStorage.stuData = JSON.stringify(stuData);
            pageNum = Math.ceil(stuData.length / 10);
            curPage = pageNum;
            renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
            renderPageSelect(pageNum);
        }
    })
})

// 跳转到新增学生
$('#addStuBtnByForm').click(function(){
    goToAddStu();
})

// 姓名的验证
$('#stuName').blur(function(e){
    if($(e.target).val()){
        // 说明输入框有东西
        $('#validateName').html('');
    } else {
        // 说明输入框没有东西
        $('#validateName').html('请填写姓名');
    }
})

// 邮箱的验证
$('#stuEmail').blur(function(e){
    if($(e.target).val()){
        // 说明输入框有东西，接下来我们来使用正则表达式进行邮箱格式的验证
        if(/^[\w\.-_]+@[\w-_]+\.com$/.test($(e.target).val())){
            $('#validateEmail').html('');
        } else {
            $('#validateEmail').html('邮箱格式不正确');
        }
    } else {
        // 说明输入框没有东西
        $('#validateEmail').html('请填写邮箱');
    }
})

// 年龄的验证
$('#stuAge').blur(function(e){
    if($(e.target).val()){
        if(isNaN($(e.target).val())){
            // 进入此 if，说明不是数字
            $('#validateAge').html('请填写正确的数字');
        } else {
            // 进入此分支，说明是数字，但是要做一下范围的判定
            if($(e.target).val() < 0 || $(e.target).val() > 100){
                $('#validateAge').html('数值范围有误');
            } else {
                $('#validateAge').html('');
            }
        }
    } else {
        // 说明输入框没有东西
        $('#validateAge').html('请填写年龄');
    }
})

// 手机号的验证
$('#stuTel').blur(function(e){
    if($(e.target).val()){
        // 说明输入框有东西，接下来我们来使用正则表达式进行邮箱格式的验证
        if(/^1[385][1-9]\d{8}/.test($(e.target).val())){
            $('#validateTel').html('');
        } else {
            $('#validateTel').html('电话号码格式不正确');
        }
    } else {
        // 说明输入框没有东西
        $('#validateTel').html('请填写电话号码');
    }
})

// 地址的验证
$('#stuAddr').blur(function(e){
    if($(e.target).val()){
        // 说明输入框有东西
        $('#validateAddr').html('');
    } else {
        // 说明输入框没有东西
        $('#validateAddr').html('请填写地址');
    }
})

// 新增学生
$('#addStuBtn').click(function(){
    let arr = $('#addStuForm').serializeArray();
    if(arr.every(function(item){
        return item.value != ''
    })){
        // 说明没有空项，接下来要看 regValidate 的 span 是否有内容，如果有，说明验证不通过
        if($('.regValidate').toArray().every(function(item){
            return $(item).html() == '';
        })){
            // 进入此分支，说明验证都通过
            const newStu = {
                stuName : arr[0].value,
                stuGender : arr[1].value,
                stuEmail : arr[2].value,
                stuAge : arr[3].value,
                stuTel : arr[4].value,
                stuAddr : arr[5].value,
            }
            if($('#addStuBtn').val() == '提交'){
                // 进入此 if，说明用户是要新增学生
                // 接下来，就应该发送 ajax 请求，将这个新的学生数据提交给服务器
                $.ajax({
                    url : /addStuByForm/,
                    type : 'POST',
                    dataType : 'json',
                    data : newStu,
                    success : function(res){
                        stuData.push(res);
                        localStorage.stuData = JSON.stringify(stuData);
                        $('#addStuForm')[0].reset(); // 清空表单
                        pageNum = Math.ceil(stuData.length / 10);
                        curPage = pageNum;
                        renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
                        renderPageSelect(pageNum);
                        goToStuList();
                    }
                })
            } else {
                // 说明用户是要修改学生
                newStu.stuId = editId;
                $.ajax({
                    url : '/editStuByForm/',
                    type : 'POST',
                    dataType : 'json',
                    data : newStu,
                    success : function(res){
                        stuData = res;
                        localStorage.stuData = JSON.stringify(res);
                        $('#addStuForm')[0].reset(); // 清空表单
                        $('#addStuBtn').val('提交');
                        renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
                        renderPageSelect(pageNum);
                        goToStuList();
                    }
                })
            }
        } else {
            window.alert('请按照要求填写每一项')
        }
    } else {
        window.alert('请填写所有的项目');
    }
})

// 返回学生列表
$('#backStuList').click(function(){
    $('#addStuForm')[0].reset();
    goToStuList();
})

// 编辑学生按钮对应事件
$('#stuTable').on('click','.editBtn', function(e){
    var stuId = e.target.dataset.id; // 获取要编辑的学生的 id
    goToAddStu(stuId);
})

// 删除学生对应的事件
$('#stuTable').on('click','.delBtn', function(e){
    var stuId = e.target.dataset.id; // 获取要删除的学生的 id
    if(window.confirm('是否要删除此名学生？')){
        // 发送 ajax 请求进行删除操作
        $.ajax({
            url : '/delStu/' + stuId,
            type : 'DELETE',
            dataType : 'json',
            success : function(res){
                stuData = res;
                localStorage.stuData = JSON.stringify(res);
                pageNum = Math.ceil(stuData.length / 10);
                if(curPage > pageNum){
                    curPage = pageNum;
                }
                renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
                renderPageSelect(pageNum);
            }
        })
    }
})

// 渲染分页组件的函数，将下面的分页渲染出来
// 接收 1 个参数：总页数
const renderPageSelect = function(pageNum){
    var left = '<li>&lt;</li>';
    var right = '<li>&gt;</li>';
    var center = '';
    // 如果总页码数少于 8 页，正常全部渲染
    if(pageNum <= 8){
        for(var i=1; i<= pageNum; i++){
            if(i == curPage){
                center += '<li class="currentPage">' + i +'</li>';
            } else {
                center += '<li>' + i + '</li>';
            }
        }
    } else {
        // 进入 else，说明总页码数超出了 8 页，不能显示所有，需要显示小圆点
        // 这里又分为 3 种情况
        if(curPage <= 3){
            // 当前页码数小于 3，小圆点应该拼接在后面
            for(var i=1; i<= 3; i++){
                if(i == curPage){
                    center += '<li class="currentPage">' + i +'</li>';
                } else {
                    center += '<li>' + i + '</li>';
                }
            }
            center += '.....'  + '<li>' + pageNum + '</li>';
        } else if(curPage > pageNum - 3){
            // 当前页码数接近最后的页数，小圆点应该拼接在前面
            center += '<li>' + 1 + '</li>' + '.....';
            for(var i=pageNum - 3; i<= pageNum; i++){
                if(i == curPage){
                    center += '<li class="currentPage">' + i +'</li>';
                } else {
                    center += '<li>' + i + '</li>';
                }
            }
        } else {
            // 说明页码在中间，两边都要拼接小圆点
            center += '<li>' + 1 + '</li>' + '.....';
            for(var i=curPage - 2; i<= curPage + 2; i++){
                if(i == curPage){
                    center += '<li class="currentPage">' + i +'</li>';
                } else {
                    center += '<li>' + i + '</li>';
                }
            }
            center += '.....' + '<li>' + pageNum + '</li>'
        }
    }
    
    $('#pageSelect').html(left + center + right);
}

// 为整个分页栏添加点击事件
$('#pageSelect').on('click','li', function(e){
    if($(e.target).html() == '&lt;'){
        // 说明用户点击的是上一页
        curPage--;
        if(!curPage){
            curPage = 1;
            window.alert('当前已经是第一页了');
        }
        renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
        renderPageSelect(pageNum);
    }
    if($(e.target).html() == '&gt;'){
        // 说明用户点击的是下一页
        curPage++;
        if(curPage > pageNum){
            curPage = pageNum;
            window.alert('当前已经是最后一页了');
        }
        renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
        renderPageSelect(pageNum);
    }
    if(!isNaN($(e.target).html())){
        // 说明点击的是具体的页码
        curPage = parseInt($(e.target).html());
        renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
        renderPageSelect(pageNum);
    }
})

// 搜索功能
$('#searchBtn').click(function(){
    var selectSearchItem = $('#selectSearchItem').val();
    var searchContent = $('#searchStu').val();
    // 根据用户输入的内容，将用户输入的内容发送 ajax 请求
    $.ajax({
        url : '/searchStu/',
        type : 'POST',
        dataType : 'json',
        data : {
            selectSearchItem,
            searchContent
        },
        success : function(res){
            if(res.length){
                // 说明有搜索的内容
                    stuData = res;
                    pageNum = Math.ceil(res.length / 10);
                    curPage = 1;
                    renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
                    renderPageSelect(pageNum);
            } else {
                // 说明没有搜索的内容
                $('#stuTable').html('没有找到内容');
                $('#pageSelect').html('');
            }
        }
    })
})

// 返回按钮对应的事件
$('#backBtn').click(function(){
    $('#searchStu').val('');
    stuData = JSON.parse(localStorage.stuData);
    pageNum = Math.ceil(stuData.length / 10);
    renderTable(stuData.slice((curPage - 1) * 10, curPage * 10));
    renderPageSelect(pageNum);
})