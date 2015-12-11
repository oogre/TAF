(function(){
Template.__checkName("mainmenu");
Template["mainmenu"] = new Template("Template.mainmenu", (function() {
  var view = this;
  return HTML.UL({
    "class": "nav"
  }, "\n		", HTML.LI("\n			", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "home"
      }));
    }
  }, "\n				", HTML.Raw('<img src="/images/logo.png">'), "\n			"), "\n		"), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "worker.index"
        }));
      },
      "class": ""
    }, "\n					", HTML.I({
      "class": "fa fa-fw fa-2x fa-users"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Travailleurs\n				"), "\n			"), "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "shop.index"
        }));
      },
      "class": ""
    }, "\n					", HTML.I({
      "class": "fa fa-fw fa-2x fa-smile-o"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Magasins/Clients\n				"), "\n			"), "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "module.index"
        }));
      },
      "class": ""
    }, "\n					  ", HTML.I({
      "class": "fa fa-fw fa-2x fa-cube"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Meubles/Chambres\n				"), "\n			"), "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "task.index"
        }));
      },
      "class": ""
    }, "\n					  ", HTML.I({
      "class": "fa fa-fw fa-2x fa-wrench"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Tâches\n				"), "\n			"), "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "matter.index"
        }));
      },
      "class": ""
    }, "\n					  ", HTML.I({
      "class": "fa fa-fw fa-2x fa-cogs"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Matériels\n				"), "\n			"), "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "user.signout"
        }));
      }
    }, "\n					", HTML.I({
      "class": "fa fa-fw fa-2x fa-sign-out"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Déconnection\n				"), "\n			"), "\n		" ];
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "home"
        }));
      },
      "class": function() {
        return Blaze.If(function() {
          return Spacebars.call(view.lookup("currentUser"));
        }, function() {
          return null;
        }, function() {
          return "active";
        });
      }
    }, "\n					", HTML.I({
      "class": "fa fa-fw fa-2x fa-sign-in"
    }), HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Connection\n				"), "\n			"), "\n		" ];
  }), "\n	");
}));

}).call(this);
