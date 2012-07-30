// functions


// onready
$().ready(function() {

	$('body').live('click', function(e) {
		var clickX = e.pageX,
				clickY = e.pageY;
				
		now.submitClick(clickX, clickY);
	});
});

// now shit

now.showClick = function(touchX, touchY, color) {
	console.log(color);
	var $clickCircle 	= $('<div class="click-circle"></div>');
			finalTop			= touchY - 49,
			finalLeft			= touchX - 49;
			
	$('body').append($clickCircle);
	$clickCircle.css({'border': '1px solid '+color, 'top': (touchY)+'px', 'left': (touchX)+'px', 'background-color': color});	
	$clickCircle.animate({
		width: '100px',
		height: '100px',
		top: finalTop+'px',
		left: finalLeft+'px',
		opacity: 0
	}, 800, 'linear', function() {
		$(this).remove();
	});
	
		// $clickCircle.animate({backgroundColor: 'rgba(255, 255, 255, 0)'});
}

now.updateUsersList = function(usersHash) {
	var userName,
			userColor,
			usersListHtml = '';
			
	$('.users-list').empty();
	for (var clientId in usersHash) {
		userColor = usersHash[clientId].color;
		userName = usersHash[clientId].username;
		
		usersListHtml += '<li class="user-item">'+
			'<span class="user-label" style="background-color: '+userColor+'"></span>'+
			'<span class="user-name">'+userName+'</span>'+
		'</li>';
	}
	$('.users-list').append(usersListHtml);
	
}