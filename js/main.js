$(document).ready(function() {
	//$('.date-pick').datePicker({clickInput:true, createButton: false, verticalOffset: 28});

	window.app = AppController.init({});
	
	$(".date-pick").bind("click", function() {
		$(this).datePicker({clickInput:true, createButton: false, verticalOffset: 28});
	});
});