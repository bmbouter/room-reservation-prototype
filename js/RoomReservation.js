$(function() {

	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name:  'Add A Room',
			state: 'shown',
		}
	});

	// The Room collection, composed of at least one RoomReservation model
	var Rooms = Backbone.Collection.extend({
		model: RoomReservation
	});

	// View for the RoomReservation model
	var RoomReservationView = Backbone.View.extend({
		tagName:   "fieldset",
		className: "room-wrap",
		template: $("#roomres-template").html(),
		events: {
			"click .room-names input" : "updateName"
		},
		initialize: function() {
			_.bindAll(this, "toggleState");
			this.model.bind('change:state', this.toggleState);
		},
		render: function(model) {
			var templ = _.template(this.template);
			this.$el.html(templ(this.model.toJSON()));
			if (this.model.get("state") == "pre-click") {
				this.$el.addClass("add");
			}
			console.log('new room view rendered');
			return this;
		},
		updateName: function(e) {
			this.model.set("name", e.currentTarget.defaultValue);
			console.log(this.model.get("name"));
		},
		toggleState: function() {
			console.log('toggle');
			if (this.model.get("shown") == true) {
				$(this.el).find(".room").slideUp();
			} else {
				$(this.el).find(".room").slideDown();
			}
		}
	});

	var AppView = Backbone.View.extend({
		el: $("#room-reservations"),
		events: {
			"click #add" : "addRoom",
			"click .delete"        : "removeReservation",
			"click .toggle" : "toggleModel"
		},
		initialize: function() {
			this.roomsCollection = new Rooms();
			this.render();
		},
		render: function() {
			var that = this;
			that.renderRoom();
		},
		renderRoom: function() {
			var room     = new RoomReservation;
			var roomView = new RoomReservationView({
				model: room,
				id: "reservation-" + this.roomsCollection.length
			});
			this.roomsCollection.add(roomView);
			this.$el.append(roomView.render().el);
		},
		addRoom: function() {

		},
		removeReservation: function(e) {
			if (this.roomsCollection.length == 1) {
				console.log("can't remove a single reservation");
			} else {
				var id  = $(e.currentTarget).parents('.room-wrap').attr('id');
				var obj = this.roomsCollection.get(id);
				this.roomsCollection.remove(obj);
			}
		},
		toggleModel: function(e) {
			var id = $(e.currentTarget).parent().attr('id');
			var obj = this.roomsCollection.get(id);
			console.log(obj.get("shown"));
			obj.set("state", !obj.get("shown"));
			console.log(obj.get("state"))
		}
	});

	var App = new AppView();


});










