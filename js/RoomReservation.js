	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name:  'Add A Room',
			hiddenName: 'Room Reservation',
			shown: true,
			canBeRemoved: false,
		}
	});

	// The Room collection, composed of at least one RoomReservation model
	var Rooms = Backbone.Collection.extend({
		model: RoomReservation,
		initialize: function() {
			return this;
		},
		renderRoom: function() {
			var room     = new RoomReservation({radioGroup : "reservation-" + this.length});
			var roomView = new RoomReservationView({
				model: room,
				id: "reservation-" + this.length
			});
			this.add(roomView);
			this.updateCanBeRemoved();
		},
		updateCanBeRemoved: function() {
			if (this.length > 1) {
				console.log('yes');
				_.each(this.models, function(model) {
					model.set("canBeRemoved", true);
					console.log(model.get("canBeRemoved"));
				});
			} else {
				_.each(this.models, function(model) {
					model.set("canBeRemoved", false);
				});
			}
		}
	});
	
	// This view will contain all of the RoomReservation models
	var RoomsCollectionView = Backbone.View.extend({
		initialize: function() {
			this.el              = $("#room-reservations");
			this.roomsCollection = new Rooms();

			var that = this;
			this.roomsCollection.on("add", function(model) {
				that.append(model);
			});

			this.roomsCollection.renderRoom();

			_.bindAll(this, "append");

			return this;
		},
		addRoomReservation: function() {
			this.roomsCollection.renderRoom();
		},
		append: function(model) {
			$(this.el).append(model.toJSON().render().el);
		}
	});

	// View for the RoomReservation model
	var RoomReservationView = Backbone.View.extend({
		tagName:   "fieldset",
		className: "room-wrap",
		template: $("#roomres-template").html(),
		events: {
			"click .room-names input" : "updateName",
			"click .toggle, .hidden-view"           : "toggleStateAttr",
			"click .delete.show"           : "removeReservation"
		},
		initialize: function() {
			_.bindAll(this, "changeReservationName", "updateRemove", "toggleState");
			this.model.bind("change:shown", this.toggleState);
			this.model.bind("change:name",  this.changeReservationName);
			this.model.bind("change:canBeRemoved", this.updateRemove);
		},
		render: function(model) {
			var templ = _.template(this.template);
			this.$el.html(templ(this.model.toJSON()));
			return this;
		},
		updateName: function(e) {
			var selected = e.currentTarget.defaultValue;
			this.model.set("hiddenName", selected + " Room Reservation");
			this.model.set("name", selected);
		},
		changeReservationName: function() {
			$(this.$el).find("legend.main-legend").text(this.model.get("name"));
			$(this.$el).find("span.hidden-title").text(this.model.get("hiddenName"));
		},
		toggleStateAttr: function() {
			this.model.set("shown", !this.model.get("shown"));
		},
		toggleState: function() {
			if (this.model.get("shown") === false) $(this.el).addClass("hidden").find(".room").slideUp();
			else                                   $(this.el).removeClass("hidden").find(".room").slideDown();
		},
		updateRemove: function() {
			console.log('update remove');
			if (this.model.get("canBeRemoved") === true) {
				$(this.el).find(".delete").addClass("show");
			} else {
				$(this.el).find(".delete").removeClass("show");
			}
		},
		removeReservation: function() {
			console.log('remove this: ' + this.model);
			//this.roomsCollection.remove(obj);
		}
	});

	var AppController = {
		init: function() {
			this.roomsCollectionView = new RoomsCollectionView();

			$("#add").click(function() {window.app.addReservation();});

			return this;
		},
		addReservation: function() {
			this.roomsCollectionView.addRoomReservation();
		}
	};










