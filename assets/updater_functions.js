/* eslint-disable no-undef */
var socket = io();

console.log("Starting");
var stats = {};
//var [encode], [title], [episode], [time], [tl], [ts], [edit], [qc];


socket.on("init-stats", function(val) {
	if (val["command"] !== "title" && val["command"] !== "episode") {
		//console.log(val["command"]);

		var dispCommand = "";
		if (val["command"] === "tl")
			dispCommand = "Translation";
		else if (val["command"] === "edit")
			dispCommand = "Editing";
		else if (val["command"] === "ts")
			dispCommand = "Typesetting";
		else if (val["command"] === "time")
			dispCommand = "Timing";
		else if (val["command"] === "encode")
			dispCommand = "Encoding";
		else if (val["command"] === "tlc")
			dispCommand = "TLC";
		else if (val["command"] === "qc")
			dispCommand = "QC";



		stats[val["command"]] = new ProgressBar.Line("#pb-" + val["command"], {
			easing: "easeInOut",
			color: "#287fb8",
			trailColor: "#555",
			trailWidth: 1,
			svgStyle: {
				width: "100%",
				height: "50%"
			},
			text: {
				style: {
					autoStyleContainer: false,
					color: "#fff",
					fontFamily: "\"Open Sans\", Helvetica, Arial, sans-serif",
					fontSize: "3.4vh",
					position: "absolute",
					width: "100%",
					textAlign: "center",
					fontWeight: "600",
					top: "0%"
				}
			},
			step: (state, bar) => {
				bar.setText(dispCommand + ": " + Math.round(bar.value() * 100) + "%");
			}
		});
		stats[val["command"]].animate(val["value"]);
	} else {
		console.log(val["value"]);
		if (val["command"] === "title") {
			$("#pb-title").text(val["value"]);
		} else {
			$("#pb-episode").text("Episode: " + val["value"]);
		}
	}
});


socket.on("update-stats", function(val) {
	console.log("Updating");
	if (val["command"] !== "title" && val["command"] !== "episode") {
		stats[val["command"]].animate(val["value"] / 100);
	} else {
		if (val["command"] === "title") {
			$("#pb-title").text(val["value"]);
		} else {
			$("#pb-episode").text("Episode: " + val["value"]);
		}
	}

});

socket.on("update-users", function(val) {
	$("#totalUsers").text("Users: " + val);
});

socket.on("date-update", function(val) {
	$("#update").text(val);
});