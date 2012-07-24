
	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name:  'Add A Room',
			shown: true,
		}
	});

	

	// The Room collection, composed of at least one RoomReservation model
	var Rooms = Backbone.Collection.extend({
		model: RoomReservation,
		initialize: function() {

			this.renderRoom();

			return this;
			
		},
		renderRoom: function() {
			var room     = new RoomReservation({radioGroup : "reservation-" + this.length});
			var roomView = new RoomReservationView({
				model: room,
				id: "reservation-" + this.length
			});
			this.add(roomView);
			console.log('rendering room, length: ' + this.length);
		}
	});
	
	// This view will contain all of the RoomReservation models
	var RoomsCollectionView = Backbone.View.extend({
		model: Rooms,
		initialize: function() {
			this.el = $("#room-reservations");
			_.bindAll(this, "append");

			return this;
		},
		append: function(model) {
			$(this.el).append(model);
		}
	});

	// View for the RoomReservation model
	var RoomReservationView = Backbone.View.extend({
		tagName:   "fieldset",
		className: "room-wrap",
		template: $("#roomres-template").html(),
		events: {
			"click .room-names input" : "updateName",
			"click .toggle"           : "toggleStateAttr",
		},
		initialize: function() {
			_.bindAll(this, "changeReservationName", "toggleState");
			this.model.bind("change:shown", this.toggleState);
			this.model.bind("change:name",  this.changeReservationName);
		},
		render: function(model) {
			var templ = _.template(this.template);
			this.$el.html(templ(this.model.toJSON()));
			return this;
		},
		updateName: function(e) {
			this.model.set("name", e.currentTarget.defaultValue);
		},
		changeReservationName: function() {
			$(this.$el).find("legend.main-legend").text(this.model.get("name"));
		},
		toggleStateAttr: function() {
			this.model.set("shown", !this.model.get("shown"));
		},
		toggleState: function() {
			if (this.model.get("shown") === false) $(this.el).find(".room").slideUp();
			else                                   $(this.el).find(".room").slideDown();
		}
	});

	var AppController = {
		init: function() {
			this.roomsView = new RoomsCollectionView();
			this.roomsCollection = new Rooms();

			this.roomsCollection.on("add", function(model) {
				console.log(this.roomsView);
				this.roomsView.append(model);
			});

			$("#add").click(function() {window.app.addReservation();});

			return this;
		},
		addReservation: function() {
			this.roomsCollection.renderRoom();
		},
		removeReservation: function(e) {
			if (this.roomsCollection.length == 1) {
				console.log("can't remove a single reservation");
			} else {
				var id  = $(e.currentTarget).parents('.room-wrap').attr('id');
				var obj = this.roomsCollection.get(id);
				this.roomsCollection.remove(obj);
			}
		}
	};










