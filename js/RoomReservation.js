	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name:  'Add A Room',
			hiddenName: 'Room Reservation',
			shown: true,
			radioGroup: '1'
		}
	});

	// The Room collection, composed of at least one RoomReservation model
	var RoomsCollection = Backbone.Collection.extend({
		model: RoomReservation,
		initialize: function() {
			return this;
		}
	});
	
	// This view will contain all of the RoomReservation models
	var RoomsCollectionView = Backbone.View.extend({
		initialize: function() {
			this.el              = $("#room-reservations");
			this.roomsCollection = new RoomsCollection();
			
			//_.bindAll(this, "append");
			
			var that = this;
			this.roomsCollection.on("add", function(model) {
				that.append(model);
				that.updateDelete();
			});
			this.roomsCollection.on("remove", function(model) {
				that.updateDelete();
			});

			this.addRoomReservation();

			return this;
		},
		addRoomReservation: function() {
			
			var room     = new RoomReservation();
			var id       = room.cid;
			room.set("radioGroup", id);
			var roomView = new RoomReservationView({
				model: room,
				id: "reservation-" + id,
				collection: this.roomsCollection,
			});
			this.roomsCollection.add(roomView);
		},
		append: function(model) {
			$(this.el).append(model.toJSON().render().el);
		},
		updateDelete: function() {
			if (this.roomsCollection.length > 1) {
				_.each(this.roomsCollection.models, function(model) {
					$(model.get("el")).find(".delete").addClass("show");
				});
			} else {
				_.each(this.roomsCollection.models, function(model) {
					$(model.get("el")).find(".delete").removeClass("show");
				});
			}
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
			"click .delete" : "removeReservation"
		},
		initialize: function() {
			_.bindAll(this, "changeReservationName", "toggleState", "removeReservation");
			this.model.bind("change:shown", this.toggleState);
			this.model.bind("change:name",  this.changeReservationName);

			this.collection = this.collection;
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
		removeReservation: function() {
			this.collection.remove(this);
			this.remove();
		}
	});

	var AppController = {
		init: function() {
			this.roomsCollectionView = new RoomsCollectionView();

			$("#add").click(function() {window.app.roomsCollectionView.addRoomReservation();});

			return this;
		},
		addReservation: function() {
			this.roomsCollectionView.addRoomReservation();
		}
	};










