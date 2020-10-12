// if (!localStorage.getItem('token')) {
// }
$(function () {
  getUserInfo();

  // 退出功能
  /**
    1、退出按钮绑定点击事件
    2、点击事件触发，弹出确认框
    3、回调里面执行
      1、清除token
      2、跳转页面
      3、关闭弹出框
   */

  const layer = layui.layer;
  // 点击按钮，实现退出功能
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (
      index
    ) {
      // 1. 清空本地存储中的 token
      localStorage.removeItem('token');
      // 2. 重新跳转到登录页面
      location.href = '/login.html';

      // 关闭 confirm 询问框
      layer.close(index);
    });
  });
});

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success(res) {
      if (res.status !== 0) {
        layui.layer.msg(res.message || '获取用户信息失败');
        return;
      }

      renderAvatar(res.data);
    },
    // ajax请求无论成功或者失败都会去调用
    // complete: function (res) {
    //   // console.log(res.responseJSON);
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === '身份认证失败！'
    //   ) {
    //     localStorage.removeItem('token');
    //     location.href = '/login.html';
    //   }
    // },
  });
}

// 渲染用户的头像
function renderAvatar(user) {
  // 1. 获取用户的名称
  var name = user.nickname || user.username;
  // 2. 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  // 3. 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    // 3.2 渲染文本头像
    $('.layui-nav-img').hide();
    var first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();
  }
}
