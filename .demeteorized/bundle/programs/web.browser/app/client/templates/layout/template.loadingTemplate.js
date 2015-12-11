(function(){
Template.__checkName("loadingTemplate");
Template["loadingTemplate"] = new Template("Template.loadingTemplate", (function() {
  var view = this;
  return HTML.Raw('<img class="loader" src="/images/loader.gif">');
}));

}).call(this);
