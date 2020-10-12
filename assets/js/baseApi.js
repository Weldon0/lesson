const baseUrl = 'http://ajax.frontend.itheima.net';
$.ajaxPrefilter(function (options) {
  // 公共配置
  console.log(options);
  options.url = `${baseUrl}${options.url}`;

  // 统一为需要权限的接口添加Authorization请求头
  if (options.url.indexOf('/my/') !== -1) {
    // if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    };
  }

  options.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === '身份认证失败！'
    ) {
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
  };
});
