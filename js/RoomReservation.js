	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name:  'Add A Room',
			hiddenTitle: 'Room Reservation from 1 PM - 3 PM',
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
		template:  $("#roomres-template").html(),
		events: {
			"click .room-names input"     : "updateName",
			"click .toggle, .hidden-view" : "toggleStateAttr",
			"click .delete"               : "removeReservation"
		},
		initialize: function() {
			_.bindAll(this, "changeReservationName", "toggleState", "updateHiddenTitle");
			this.model.bind("change:shown", this.toggleState);
			this.model.bind("change:name",  this.changeReservationName);
			this.model.bind("change:hiddenTitle", this.updateHiddenTitle);

			this.collection = this.collection;
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
			if (this.model.get("shown") === false) {
				this.getHiddenTitle();
				$(this.el).addClass("hidden").find(".room").slideUp();
			} else {
				$(this.el).removeClass("hidden").find(".room").slideDown();
			}
		},
		removeReservation: function() {
			$(this.el).fadeOut(function() {
				this.collection.remove(this);
				this.remove();
			});
		},
		getHiddenTitle: function() {
			// Get room, if selected
			var selected = $(this.el).find("input[name=" + this.model.cid + "-room-name]:checked").val();
			var room     = (selected == undefined) ? room = "Room Reservation" : selected;

			// Get date, if chosen
			var chosen   = $(this.el).find(".date-pick").val();
			date         = (chosen == "") ? "" : " on " + chosen;

			// Get time string
			var minFrom  = ($(this.el).find(".select-from-min").val() == 0) ? "" : ":" + $(this.el).find(".select-from-min").val();
			var minUntil = ($(this.el).find(".select-until-min").val() == 0) ? "" : ":" + $(this.el).find(".select-until-min").val();
			var time     = $(this.el).find(".select-from-hour").val() + minFrom + " " + ($(this.el).find(".select-from-ampm").val()).toUpperCase() + " - " + $(this.el).find(".select-until-hour").val() + minUntil + " " + ($(this.el).find(".select-until-ampm").val()).toUpperCase();

			this.model.set("hiddenTitle", room + " from " + time + date);
		},
		updateHiddenTitle: function() {
			$(this.$el).find("span.hidden-title").text(this.model.get("hiddenTitle"));
		}
	});

	var AppController = {
		init: function() {
			this.roomsCollectionView = new RoomsCollectionView();

			var that = this;
			$("#add").click(function() {that.roomsCollectionView.addRoomReservation();});

			$(".date-pick").live("click", function() {
				$(this).datepicker({minDate: 0, maxDate: +365});
			});

			Tipped.create(".tipp");
			
			return this;
		},
		addReservation: function() {
			this.roomsCollectionView.addRoomReservation();
		}
	};










