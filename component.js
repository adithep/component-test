if (Meteor.isClient) {
  var SBGCtrl = {
    components: {},
    add: function(guid, settings) {
      this.components[guid] = new ScrollableBtnGroup(settings);
    },
    get: function(guid) {
      return this.components[guid];
    },
    set: function(tplData) {
      this.setSelectedButton(tplData.value);
      if (_.isFunction(this.settings.onSet)) {
        this.settings.onSet(tplData.value);
      }
    },
    remove: function(guid) {
      this.components[guid]["delete"]();
      this.components[guid] = null;
      delete this.components[guid];
    }
  };

  // The component class
  var ScrollableBtnGroup = (function() {
    ScrollableBtnGroup.prototype.currentIndex = 0;

    ScrollableBtnGroup.prototype._ciDeps = new Deps.Dependency();
    ScrollableBtnGroup.prototype["delete"] = function() {};

    ScrollableBtnGroup.prototype.defaults = {
        viewBtnCount: 4,
        buttons: [],
        prevLabel: '<',
        nextLabel: '>'
    };

    function ScrollableBtnGroup(settings) {
        var k, v, _ref;
        this.settings = settings;
        _ref = this.defaults;
        for (k in _ref) {
            v = _ref[k];
            if (!this.settings[k]) {
                this.settings[k] = v;
            }
        }
    }
    ScrollableBtnGroup.prototype.setCurrentIndex = function(value) {
      if (this.currentIndex === value) {
        return;
      }
      this.currentIndex = value;
      return this._ciDeps.changed();
    };

    ScrollableBtnGroup.prototype.getCurrentIndex = function() {
      this._ciDeps.depend();
      return this.currentIndex;
    };

    ScrollableBtnGroup.prototype.next = function() {
      var ci;
      ci = this.getCurrentIndex();
      if ((ci + this.settings.viewBtnCount) >= this.settings.buttons.length) {
        return;
      }
      return this.setCurrentIndex(ci + 1);
    };

    ScrollableBtnGroup.prototype.prev = function() {
      var ci;
      ci = this.getCurrentIndex();
      if (ci <= 0) {
        return;
      }
      return this.setCurrentIndex(this.getCurrentIndex() - 1);
    };

    ScrollableBtnGroup.prototype.getActiveButtons = function() {
      var endIndex, startIndex;
      startIndex = this.getCurrentIndex();
      endIndex = startIndex + this.settings.viewBtnCount;
      return this.settings.buttons.slice(startIndex, endIndex);
    };
    return ScrollableBtnGroup;
  })();

  // The component template helpers
  Template.scrollableBtnGroup.created = function() {
    console.log(this);
    console.log(Blaze);
    this.data.guid = this.__view__.template.__viewName;
    SBGCtrl.add(this.__view__.template.__viewName, this.data.settings);
  };

  Template.scrollableBtnGroup.destroyed = function() {
    SBGCtrl.remove(this.__component__.guid);
  };

  Template.scrollableBtnGroup.helpers({
    viewBtnCount: function() {
      return SBGCtrl.get(this.guid) && SBGCtrl.get(this.guid).settings.viewBtnCount;
    },
    buttonCount: function() {
      return SBGCtrl.get(this.guid) && SBGCtrl.get(this.guid).settings.buttons.length;
    },
    buttons: function() {
      return SBGCtrl.get(this.guid) && SBGCtrl.get(this.guid).settings.buttons;
    },
    prevLabel: function() {
      return SBGCtrl.get(this.guid) && SBGCtrl.get(this.guid).settings.prevLabel;
    },
    nextLabel: function() {
      return SBGCtrl.get(this.guid) && SBGCtrl.get(this.guid).settings.nextLabel;
    },
    buttonsActive: function() {
      return SBGCtrl.get(this.guid) && SBGCtrl.get(this.guid).getActiveButtons();
    },
    label: function() {
      return this;
    }
  });
  Template.scrollableBtnGroup.events({
    'click .scrollable-btn-group-prev': function(evt, tpl) {
      SBGCtrl.get(tpl.data.guid).prev(this);
    },
    'click .scrollable-btn-group-next': function(evt, tpl) {
      SBGCtrl.get(tpl.data.guid).next(this);
    }
  });

  Template.someTemplate.helpers({
    settings: function(){
      return {
        viewBtnCount: 2,
        buttons: ["buttons", "this", "you", "me", "five", "six"]
      };
    },
    haha: function(){
      return Template.scrollableBtnGroup;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
