$(function () {
  const form = layui.form;
  const layer = layui.layer;

  form.verify({
    nickname: (value) => {
      console.log(value);

      if (value.length > 6) {
        return '用户昵称只能是1-6位';
      }
    },
  });

  // 获取用户信息
  initUserInfo();
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'GET',
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '获取用户信息失败');
          return;
        }
        // 给form表单lay-filter属性的表单赋值，第一个参数为lay-filter的值
        // form是layui提供的,layui.form
        form.val('formUserInfo', res.data);
        console.log(res);
      },
    });
  }

  $('#btnReset').click(function (e) {
    // 阻止默认的reset重置行为
    e.preventDefault();
    // 重新调用接口获取用户信息
    initUserInfo();
  });

  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST', // 默认get
      url: '/my/userinfo', // 默认当前页
      data: $(this).serialize(), // 格式{ key:value }
      success: function (res) {
        // 请求成功回调
        if (res.status !== 0) {
          layer.msg(res.message || '更新失败');
          return;
        }
        layer.msg('更新用户信息成功！');
        // window.parent可以获取外层页面的window对象
        window.parent.getUserInfo();
        console.log(window.parent);
      },
    });
  });
});
