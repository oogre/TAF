(function(){
Template.__checkName("signup");
Template["signup"] = new Template("Template.signup", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline"
  }, HTML.Raw('\n		<fieldset>\n			<div class="input-group">\n				<label for="register-email" class="input-group-addon"><i class="fa fa-2x fa-user"></i></label>\n				<input type="email" id="register-email" class="input-lg form-control" placeholder="email">\n			</div>\n		</fieldset>\n		<br>\n		<fieldset>\n			<div class="input-group">\n				<label for="register-password" class="input-group-addon"><i class="fa fa-2x fa-eye-slash"></i></label>\n				<input type="password" id="register-password" class="input-lg form-control" placeholder="mot de passe">\n			</div>\n			<div class="input-group">\n				<label for="register-retype-password" class="input-group-addon"><i class="fa fa-2x fa-eye-slash"></i></label>\n				<input type="password" id="register-retype-password" class="input-lg form-control" placeholder="ré-écrivez le mot de passe">\n			</div>\n		</fieldset>\n		<br>\n		'), HTML.FIELDSET("\n			", HTML.Raw('<button type="submit" class="btn btn-lg btn-primary">Créer mon compte</button>'), HTML.A({
    "class": "btn btn-lg btn-link",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "home"
      }));
    }
  }, "Connection"), "\n		"), "\n	");
}));

}).call(this);
