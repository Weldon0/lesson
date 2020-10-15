$(function () {
  const form = layui.form;

  const laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };

  // 初始化列表区域
  initTable();

  // 初始化分类选择框
  initCate();
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);

        renderPage(res.total);
      },
    });
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！');
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }

  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
      theme: '#c00',
      limits: [2, 3, 5, 10],
      jump: (obj, first) => {
        // initTable会触发jump回调
        // console.log(obj);
        // initTable ==> true
        // 通过页码点击调用  ==> undefined
        console.log('first:', first);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;

        // 请求完数据重新赋值查询参数里面的pagesize
        q.pagesize = obj.limit;
        if (!first) {
          // 通过页码点击调用才去执行initTable方法
          initTable();
        }
      },
    });
  }

  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    // 获取到文章的 id
    var id = $(this).attr('data-id');
    // 询问用户是否要删除数据

    // 获取页面中的数据的个数
    var len = $('.btn-delete').length;
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！');
          }
          layer.msg('删除文章成功！');

          if (len === 1) {
            // 页码值减一
            // 如果页码的值为1就不需要再减1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
