// SkratchList
// -------
// A place to jot your notes and knowledge
// Inspired by TodoMVC contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). 

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Skratch Model
  // --------
   var Skratch = Backbone.Model.extend({
        defaults: function() {
            return {
                text: 'empty text...',
                date_created: new Date().getTime() 
            };
        },
       idAttribute: "_id"
    });

  // SkratchList
  // -------   
    var SkratchList = Backbone.Collection.extend({
        model: Skratch,


        url: 'http://localhost:8080/skratches'
        //url: 'http://skratchpadapi.eliotbaker.com/skratches'
        // localStorage: new Backbone.LocalStorage("skratches-backbone")
    });

  var Skratches = new SkratchList();

  // Skratch View
  // --------------

  // The DOM element for a Skratch item...
  var SkratchView = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#skratch-template').html()),

    events: {
      "click a.update"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.addClass('list-group-item');
      this.input = this.$('.edit');
      return this;
    },

    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({text: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  var AppView = Backbone.View.extend({

    el: $("#skratchapp"),

    events: {
      "keypress #new-skratch":  "createOnEnter"
    },

    initialize: function() {

      this.input = this.$("#new-skratch");

      this.listenTo(Skratches, 'add', this.addOne);
      this.listenTo(Skratches, 'reset', this.addAll);
      this.listenTo(Skratches, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Skratches.fetch();
    },

    render: function() {
      if (Skratches.length) {
        this.main.show();
        this.footer.show();
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    addOne: function(skratch) {
      var view = new SkratchView({model: skratch});
      this.$("#skratch-list").prepend(view.render().el);
    },

    addAll: function() {
      Skratches.each(this.addOne, this);
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Skratches.create({text: this.input.val()});
      this.input.val('');
    }

  });

  var App = new AppView;

});


// Skratchpad Tasks
// --------------
// - [x] create skratch note item
// - [x] view previous skratch note items
// - [x] style it with the bootstrapz
//       - [x] use edit button instead of doubleclick
//       - [c] create larger text input box
//       - [c] make text size smaller
//       - [x] allow for full text to be seen, enlargening note
//       - [ ] review mobile version
// - [x] put it on a server
// - [ ] throw users on it - passport?
// - [ ] log server interactions that could be human readable
