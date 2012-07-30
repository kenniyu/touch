// vars
var lastMoveTime = (new Date()).getTime();
	
// functions
function attachAndAnimateClick(touchX, touchY, userObj) {
	var $clickCircle 		= $('<div class="click-circle"></div>');
			finalTop				= touchY - 49,
			finalLeft				= touchX - 49,
			color 					= userObj.color,
			animationDelay	=	userObj.animationDelay;
			
	$('body').append($clickCircle);
	$clickCircle.css({'border': '1px solid '+color, 'top': (touchY)+'px', 'left': (touchX)+'px', 'background-color': color});	
	$clickCircle.animate({
		width: '100px',
		height: '100px',
		top: finalTop+'px',
		left: finalLeft+'px',
		opacity: 0
	}, animationDelay, 'linear', function() {
		$(this).remove();
	});
}

function animateMove(moveX, moveY, userObj) {
	var clientId 				= userObj.clientId,
			color						= userObj.color,
			animationDelay	= userObj.animationDelay,
			$newUserCursor 	= $('<div class="user-cursor" data-user-id="'+clientId+'"></div>'),
			$oldUserCursors,
			$tempUserCursor;
	
	$oldUserCursors = $('.user-cursor[data-user-id="'+clientId+'"]');
	
	$.each($oldUserCursors, function(index, userCursor) {
		$tempUserCursor = $(userCursor);
		$tempUserCursor.animate({
			opacity: 0
		}, animationDelay, 'linear', function() {
			$(this).remove();
		});
	});
	
	$newUserCursor.css({
		'border': '1px solid '+color,
		'opacity': 0.5,
		'top'		: (moveY - 15) + 'px',
		'left'	: (moveX - 15) + 'px',
		'z-index': -100
	});
	
	$('body').append($newUserCursor);
}

function toggleLights() {
	var currentLights = $('#toggle-lights').attr('data-lights');
	if (currentLights == 'on') {
		// dim the lights
		currentLights = 'off';
		$('#toggle-lights').text('lights on');
	} else {
		// turn lights on
		currentLights = 'on';
		$('#toggle-lights').text('dim lights');
	}
	$('#toggle-lights').attr('data-lights', currentLights);
	$('body').toggleClass('dim');
	$('.users-wrapper').toggleClass('dim');
}


// onready
$().ready(function() {

	$('body').live('click', function(e) {
		var clickX 		= e.pageX,
				clickY 		= e.pageY,
				$targetEl	= $(e.target);
				
		if ($targetEl.closest('input').attr('id') == 'animation-input') {
		} else if ($targetEl.closest('a').attr('id') == 'toggle-lights') {
			toggleLights();
		} else {
			now.submitClick(clickX, clickY);
		}
	});
	
	$('body').live('mousemove', function(e) {
		var currentTime = (new Date()).getTime(),
				moveX = e.pageX,
				moveY = e.pageY;
				
		if (currentTime > lastMoveTime + 1) {
			lastMoveTime = currentTime;
			now.submitMove(moveX, moveY);
		}
	});
	
	$('#animation-input').live('keypress', function(e) {
		var animationInputVal;
		if (e.keyCode == 13) {
			animationInputVal = parseInt($(this).val());
			if (animationInputVal < 1) {
				animationInputVal = 50;
				$(this).val(50);
			} else if (animationInputVal > 5000) {
				animationInputVal = 5000;
				$(this).val(5000);
			}
			now.submitAnimation(animationInputVal);
		}
	})
	
	
});

// now shit


now.showClick = function(touchX, touchY, color) {
	attachAndAnimateClick(touchX, touchY, color);
}

now.showMove = function(moveX, moveY, color, clientId) {
	animateMove(moveX, moveY, color);
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