/* eslint-disable no-undef */
$("#plug").hover(function()
{
	console.log("Hover");
	$("#plug-text").fadeIn();
}, function()
{
	$("#plug-text").stop().delay(3000).fadeOut();
}
);

var original;

$("#pb-qc").hover(function()
{
	original = $("#pb-qc > div").text();
	$("#pb-qc > div").text("Quality Checking");
}, function()
{
	$("#pb-qc > div").text(original);
}
);

$("#pb-tlc").hover(function()
{
	original = $("#pb-tlc > div").text();
	$("#pb-tlc > div").text("Translation Checking");
}, function()
{
	$("#pb-tlc > div").text(original);
}
);