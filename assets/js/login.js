$(function () {
  // const baseUrl = 'http://ajax.frontend.itheima.net';
  // 点击注册按钮跳转注册页面
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  // 点击登录按钮时候
  $('#link_login').on('click', function () {
    $('.reg-box').hide();
    $('.login-box').show();
  });

  // 自定义校验规则
  const { form, layer } = layui;

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    //  确认密码框逻辑
    // 1、定义规则
    // 2、判断当前输入的值是否跟原密码框的值相同，如果不相同return错误信息
    repwd(value) {
      // 获取原密码框值
      const pwd = $('.reg-box [name=password]').val();

      // 跟确认密码框值做判断
      if (pwd !== value) {
        // 如果两个值不一致说明密码不一致返回错误信息
        return '两次密码不一致';
      }
    },
  });

  // 注册功能
  /**
    1、监听注册表单提交事件
    2、取消默认事件
    3、发起post请求
    4、判断返回值
   */
  $('#form_reg').submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/reguser',
      method: 'POST',
      data: {
        username: $('.reg-box [name="username"]').val(),
        password: $('.reg-box [name="password"]').val(),
      },
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '注册失败');
          return;
        }
        layer.msg('注册成功');
        $('#link_login').click();
      },
    });
  });

  // 登录功能
  /**
    1、监听注册表单提交事件
    2、取消默认事件
    3、发起post请求
    4、判断返回值
    5、保存token
    6、跳转页面
   */

  $('#form_login').submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '登录失败');
          return;
        }
        layer.msg('登录成功');
        localStorage.setItem('token', res.token);
        location.href = '/index.html';
      },
    });
  });
});

/**
  1、login分支提交本地仓库
  2、login提交到github(远程仓库这时候还没有login分支)
  3、main分支merge login的代码
  4、main分支提交github
  5、创建index分支
 */
