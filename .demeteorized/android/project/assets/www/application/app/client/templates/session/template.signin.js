(function(){
Template.__checkName("signin");
Template["signin"] = new Template("Template.signin", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline"
  }, "\n		", HTML.FIELDSET("\n			", HTML.DIV({
    "class": function() {
      return [ "input-group ", Spacebars.mustache(view.lookup("userErr")) ];
    }
  }, "\n				", HTML.Raw('<label for="login-email" class="input-group-addon"><i class="fa fa-2x fa-user"></i></label>'), "\n				", HTML.Raw('<input type="email" id="login-email" class="input-lg form-control" placeholder="email">'), "\n				", Blaze.If(function() {
    return Spacebars.call(view.lookup("userErr"));
  }, function() {
    return [ "\n					", HTML.SPAN({
      "class": "glyphicon glyphicon-remove form-control-feedback",
      "aria-hidden": "true"
    }), "\n  					", HTML.SPAN({
      id: "inputError2Status",
      "class": "sr-only"
    }, "(error)"), "\n  				" ];
  }), "\n			"), "\n		"), HTML.Raw("\n		<br>\n		"), HTML.FIELDSET("\n			", HTML.DIV({
    "class": function() {
      return [ "input-group ", Spacebars.mustache(view.lookup("pwdErr")) ];
    }
  }, "\n				", HTML.Raw('<label for="login-password" class="input-group-addon"><i class="fa fa-2x fa-eye-slash"></i></label>'), "\n				", HTML.Raw('<input type="password" id="login-password" class="input-lg form-control" placeholder="mot de passe">'), "\n				", Blaze.If(function() {
    return Spacebars.call(view.lookup("pwdErr"));
  }, function() {
    return [ "\n					", HTML.SPAN({
      "class": "glyphicon glyphicon-remove form-control-feedback",
      "aria-hidden": "true"
    }), "\n  					", HTML.SPAN({
      id: "inputError2Status",
      "class": "sr-only"
    }, "(error)"), "\n  				" ];
  }), "\n			"), "\n		"), HTML.Raw('\n		<br>\n		<fieldset>\n			<button type="submit" class="btn btn-lg btn-primary">Connection</button>\n		</fieldset>\n	'));
}));

}).call(this);
