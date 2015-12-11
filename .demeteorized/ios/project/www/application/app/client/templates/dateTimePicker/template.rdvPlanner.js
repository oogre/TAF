(function(){
Template.__checkName("rdvPlanner");
Template["rdvPlanner"] = new Template("Template.rdvPlanner", (function() {
  var view = this;
  return HTML.Raw('<fieldset class="row">\n		<label class="col-sm-2">Plannification contrat de maintenance</label>\n		<div class="form-group col-sm-10">\n			<div class="input-group col-sm-12">\n				<label class="input-group-addon" for="firstdate">Premiere maintenance</label>\n				<input class="form-control input-lg" type="text" name="firstdate" id="firstdate" value="" data-date-format="dd-DD/MM/YY" readonly="" autocomplete="off" required="">\n			</div>\n		</div>\n	</fieldset>\n	<fieldset class="row">\n		<div class="form-group col-sm-offset-2 col-sm-5">\n			<div class="input-group col-sm-12">\n				<label class="input-group-addon" for="interval">Interval</label>\n				<input class="form-control input-lg" type="number" min="1" name="interval" id="interval" value="" autocomplete="off" required="">\n			</div>\n		</div>\n		<div class="form-group col-sm-5">\n			<div class="input-group col-sm-12">\n				<label class="input-group-addon" for="duration">Durée</label>\n				<input class="form-control input-lg" type="number" min="1" name="duration" id="duration" value="" autocomplete="off" required="">\n			</div>\n		</div>\n	</fieldset>');
}));

}).call(this);
