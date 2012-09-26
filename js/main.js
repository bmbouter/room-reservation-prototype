$(document).ready(function() {
	window.app = AppController.init({});
        $("#event-form").validate();
  
});


$("input[name='catering-type']").click(function() {
	if($(this).val()=="catering-food")
	{
    		$("#catering-details").show();
  	}
	else
  	{
		$("#catering-details").hide();
  	}
});
