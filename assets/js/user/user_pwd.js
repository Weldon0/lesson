$(function () {
  const form = layui.form;
  // 书写自定义校验规则的方法
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    // 新密码验证
    samePwd: (value) => {
      if (value === $('input[name=oldPwd]').val()) {
        return '新旧密码不能相同！';
      }
    },

    // 重复密码框
    rePwd: (value) => {
      if (value !== $('input[name=newPwd]').val()) {
        return '两次输入的密码不一致';
      }
    },
  });

  // 提交修改
  /**
    1、监听表单提交事件
    2、阻止默认提交
    3、发起ajax请求
    4、判断返回状态是否成功，然后不同状态提示不同语句
    5、提交以后重置表单
   */
  const layer = layui.layer;

  $('.layui-form').submit(function (e) {
    // 阻止默认提交
    e.preventDefault();
    $.ajax({
      type: 'POST', //默认get
      url: '/my/updatepwd', //默认当前页
      data: $(this).serialize(), //格式{key:value}
      success: function (res) {
        //请求成功回调
        if (res.status !== 0) {
          layer.msg(res.message || '更新密码失败');
          return;
        }

        layer.msg('更新密码成功');
        // 原生form元素reset方法
        $('.layui-form')[0].reset();
      },
    });
  });
});
