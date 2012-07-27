	// The single RoomReservation model
	var RoomReservation = Backbone.Model.extend({
		defaults: {
			name:  'Add A Room',
			hiddenTitle: 'Room Reservation',
			shown: true,
			radioGroup: '1',
			valid: false
		},
		initialize: function() {
			
		},
		isValid: function(model) {
			var valid       = true;
			var obj         = $(model.el);

			var resources   = ["laptop-cart", "tables-inside", "tables-outside", "easels", "projector", "camera", "audio-conf", "video-conf"];
			var additionals = obj.find(".additionals");

			for (var i = 0; i < resources.length; i++) {
				if (obj.find("input[name=" + this.cid + "-" + resources[i] + "]:checked").val() == undefined) {
					valid = false;
					additionals.addClass("error");
					break;
				}
			}
			if (valid) additionals.removeClass("error");

			var roomList    = obj.find(".room-names");
			var room        = roomList.find("input[name=" + this.cid + "-room-name]:checked");
			var configList  = obj.find(".configuration");
			var config      = configList.find("input[name=" + this.cid + "-configuration]:checked");
			var dateWrap    = obj.find(".date-wrap");
			var date        = dateWrap.find(".div-date-pick");
			var timeWrap    = obj.find(".time-wrap");
			var fromAmPm    = timeWrap.find(".select-from-ampm").val();
			var untilAmPm   = timeWrap.find(".select-until-ampm").val();
			var fromHour    = timeWrap.find(".select-from-hour").val();
			var untilHour   = timeWrap.find(".select-until-hour").val();
			var fromMin     = timeWrap.find(".select-from-min").val();
			var untilMin    = timeWrap.find(".select-until-min").val();

			if (fromAmPm == "pm") fromHour += 12;
			if (untilAmPm == "pm") untilHour += 12;

			if (fromHour > untilHour) {
				valid = false;
				timeWrap.addClass("error");
			} else if (fromHour == untilHour) {
				if (fromMin >= untilMin) {
					valid = false;
					timeWrap.addClass("error");
				} else {
					timeWrap.removeClass("error");
				}
			} else {
				timeWrap.removeClass("error");
			}

			if (room.val() == undefined) {
				valid = false;
				roomList.addClass("error");
			} else {
				roomList.removeClass("error");
			}

			if (config.val() == undefined) {
				valid = false;
				configList.addClass("error");
			} else {
				configList.removeClass("error");
			}

			if (date.text() == "") {
				valid = false;
				dateWrap.addClass("error");
			} else {
				dateWrap.removeClass("error");
			}

			return valid;
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
			"click .toggle, .hidden-view" : "toggleShownAttr",
			"click .delete.show"          : "removeReservation"
		},
		initialize: function() {
			_.bindAll(this, "changeReservationName", "toggleState", "updateHiddenTitle");
			this.model.bind("change:shown", this.toggleState);
			this.model.bind("change:name",  this.changeReservationName);
			this.model.bind("change:hiddenTitle", this.updateHiddenTitle);

			this.collection = this.collection;

			var templ = _.template(this.template);
			this.$el.html(templ(this.model.toJSON()));

                        var that = this;
			this.$el.find(".date-pick").datepicker({minDate: 0, maxDate: +365, autoSize: true, onSelect: function(dateText, inst) {
                                        that.render(this.model);
					var input = $(inst.input).siblings(".div-date-pick");
					if (input.text() == "") input.text(dateText);
					else input.text(input.text() + ", " + dateText);
				}
			});
		},
		render: function(model) {
                        Tipped.remove(".tipp");
                        //Update the labels here like so:    this.$(".wachovia").attr("title", this.count);
                        Tipped.create(this.$(".tipp"), {hook: "rightmiddle"});
			return this;
		},
		updateName: function(e) {
			this.model.set("name", e.currentTarget.defaultValue);
		},
		changeReservationName: function() {
			$(this.$el).find("legend.main-legend").text(this.model.get("name"));
		},
		toggleShownAttr: function() {
			if (this.model.isValid(this)) this.model.set("shown", !this.model.get("shown"));
		},
		toggleState: function() {
			if (this.model.get("shown") === false) {
				this.getHiddenTitle();
				$(this.el).addClass("hidden").find(".room").slideUp();
			} else {
				$(this.el).removeClass("hidden").find(".room").slideDown();
			}
			$(".tipp.wachovia").attr("title", "this is updated text");
			Tipped.refresh(".tipp.wachovia")
		},
		removeReservation: function() {
			var that = this;
			$(this.el).fadeOut(function() {
				that.collection.remove(this);
				that.remove();
			});
		},
		getHiddenTitle: function() {
			// Get room, if selected
			var selected = $(this.el).find("input[name=" + this.model.cid + "-room-name]:checked").val();
			var room     = (selected == undefined) ? room = "Room Reservation" : selected;

			// Get date, if chosen
			var chosen   = $(this.el).find(".div-date-pick").text();
			dates        = (chosen == "") ? "" : " on " + chosen;

			// Get time string
			var minFrom  = ($(this.el).find(".select-from-min").val() == 0) ? "" : ":" + $(this.el).find(".select-from-min").val();
			var minUntil = ($(this.el).find(".select-until-min").val() == 0) ? "" : ":" + $(this.el).find(".select-until-min").val();
			var time     = $(this.el).find(".select-from-hour").val() + minFrom + " " + ($(this.el).find(".select-from-ampm").val()).toUpperCase() + " - " + $(this.el).find(".select-until-hour").val() + minUntil + " " + ($(this.el).find(".select-until-ampm").val()).toUpperCase();

			this.model.set("hiddenTitle", room + " from " + time + dates);
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

			return this;
		},
		addReservation: function() {
			this.roomsCollectionView.addRoomReservation();
		}
	};










