/**
  1、引入artTemplate
  2、请求分类数据
  3、使用模板渲染
 */

$(function () {
  const layer = layui.layer;
  const form = layui.form;
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) {
          layui.layer.msg(res.message || '获取类别失败');
          return;
        }

        const htmlString = template('tpl-table', res);
        $('tbody').html(htmlString);
      },
    });
  }

  // 为添加类别按钮绑定点击事件
  let indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });

  /**
    1、监听表单提交事件(通过事件代理)body上面
    2、阻止默认提交
    3、发起ajax
    4、判断返回值
    5、重新获取分类数据
    6、关闭弹出层
   */

  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        // 判断返回值
        if (res.status !== 0) {
          return layer.msg('新增分类失败！');
        }
        // 重新获取分类数据方法
        initArtCateList();
        layer.msg('新增分类成功！');
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd);
      },
    });
  });

  // 编辑功能
  let indexEdit = null;
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });

    // 发起ajax请求
    const id = $(this).data('id');
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data);
      },
    });
  });

  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！');
        }
        layer.msg('更新分类数据成功！');
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).data('id');
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！');
          }
          layer.msg('删除分类成功！');
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
