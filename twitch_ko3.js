var fccTwitchUsersInit = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff","MedryBW"];
// var allUsers = [], onlineUsers = [], offlineUsers = [];
var temprecords = [];
var url = 'https://api.twitch.tv/kraken/', cb = '?callback=?';

var ViewModel = function() {
	var self = this;

	self.records = ko.observableArray();
  self.onlineUsers = ko.observableArray();
  self.offlineUsers = ko.observableArray();

	var Record = function(name,logo,status,streamTitle,username) {
		var self = this;
		self.name = ko.observable(name);
		self.logo = ko.observable(logo);
		self.status = ko.observable(status);
		self.streamTitle = ko.observable(streamTitle);
    self.username = ko.observable(username);
    self.userhref =  ko.observable("http://twitch.tv/" + username);
	};

	fccTwitchUsersInit.forEach(function(stream) {
		var obj = {};
		// see if user is streaming or not
		$.getJSON(url + 'streams/' + stream + cb).success(function(data) {
			var streaming = (data.stream === null) ? false : true;
			if (streaming) {
				obj.status = 'green-text fa fa-check fa-2x';
				var streamTitle = data.stream.channel.status;

				obj.streamTitle = streamTitle;
			} else {
				obj.status = 'red-text fa fa-minus-circle fa-2x';
				obj.streamTitle = '';
			}
			obj.username = stream;

			// get username and logo and push to array
			$.getJSON(url + 'users/' + stream + cb).success(function(data) {
				obj.name = data.display_name;
				obj.logo = data.logo || 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/326176/person-placeholder.jpg';

				var tr = new Record(obj.name, obj.logo, obj.status, obj.streamTitle, obj.username);
				temprecords.push(tr);

        self.records.push(tr);
				if (streaming) {
					 self.onlineUsers.push(tr);
				} else {
					 self.offlineUsers.push(tr);
				}
			});
		});
	});

	self.nameSearch = ko.observable('');
	self.filteredRecords = ko.computed(function() {
		return ko.utils.arrayFilter(self.records(), function(r) {
			return r.name().toLowerCase().indexOf(self.nameSearch().toLowerCase()) >= 0;
		});
	});
};

ko.applyBindings(new ViewModel());
