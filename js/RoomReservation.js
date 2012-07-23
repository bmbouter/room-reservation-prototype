$(function() {

	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name: 'Add A Room'
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
		render: function() {
			var templ = _.template(this.template);
			this.$el.html(templ(this.model.toJSON()));
			console.log('room view rendered');
			return this;
		}
	});

	var AppView = Backbone.View.extend({
		el: $("#room-reservations"),
		events: {
			"click .room-wrap.add" : "renderRoom",
			"click .delete" : "removeReservation"
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
			var room     = new RoomReservation();
			var roomView = new RoomReservationView({
				model: room
			});
			this.roomsCollection.add(roomView);
			this.$el.append(roomView.render().el);			
		},
		removeReservation: function() {
			if (this.roomsCollection.length == 1) {
				console.log("can't remove a single reservation.");
			} else {
				//this.model.destroy();
				this.remove();
				console.log('remove');
			}
		}
	});

	var App = new AppView();

});










