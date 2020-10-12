const baseUrl = 'http://ajax.frontend.itheima.net';
$.ajaxPrefilter(function (options) {
  // 公共配置
  console.log(options);
  options.url = `${baseUrl}${options.url}`;
});
