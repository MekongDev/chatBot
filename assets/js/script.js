$(document).ready(function() {

	// Credentials
	var baseUrl = "https://api.dialogflow.com/v1/";
	var accessToken = "43495d56f78a40d1b4d78ae90beee206";

	//domain
	const domain = './assets/' //http://madketing.com.ar/chat/assets/

	//---------------------------------- Add dynamic html bot content(Widget style) ----------------------------
	// You can also add the html content in html page and still it will work!
	var mybot = '<div class="chatCont" id="chatCont">'+
								'<div class="bot_profile">'+
									'<img src="'+domain+'img/logo2.png" class="bot_p_img">'+
									'<div class="close" style="width: 22px; height: 22px;">'+
										'<i class="fa fa-times" aria-hidden="true" style="color: #000000;"></i>'+
									'</div>'+
								'</div><!--bot_profile end-->'+
								'<div id="result_div" class="resultDiv">'+'<p class="botResult">Hola, soy Carla! responsable comercial. En que puedo ayudarte?</p><div class="clearfix"></div>'+'</div>'+
								'<div class="chatForm" id="chat-div">'+
									'<div class="spinner">'+
										'<div class="bounce1"></div>'+
										'<div class="bounce2"></div>'+
										'<div class="bounce3"></div>'+
									'</div>'+
									'<input type="text" id="chat-input" autocomplete="off" placeholder="Escribe tu pregunta.."'+ 'class="form-control bot-txt"/>'+
									'<button type="submit" id="send-button" class="sendButton"><img src="'+domain+'img/send-button.png"/></button>'+
								'</div>'+
							'</div><!--chatCont end-->'+

							'<div class="profile_div">'+
								'<div class="row" style="width: 80px;">'+
									'<div class="col-hgt">'+
										'<img src="'+domain+'/img/logo.png" class="img-circle img-profile">'+
									'</div><!--col-hgt end-->'+
								'</div><!--row end-->'+
							'</div><!--profile_div end-->';

	// $("mybot").html(mybot);

	// ------------------------------------------ Toggle chatbot -----------------------------------------------
	$('.profile_div').click(openChat);

	$('.pop-up-content-title').click(openChat);

	$('.pop-up-text-container').click(openChat);

	$('.fake-input-container').click(openChat);

	$('#closeChat').click(closeChat);

	function openChat(){
		$('.profile_div').toggle();
		$('.chatCont').toggle('fast');
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
		history.pushState({ state: 'open chat clicked' }, 'chat', '#' );
		if (window.innerWidth>600) document.getElementById('chat-input').focus();
	}

	function closeChat(){
		$('.profile_div').toggle();
		$('.chatCont').toggle('fast');
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
		$('.pop-up-container:visible').hide();
	};

	window.onpopstate = function (event) {
		event.preventDefault();
		closeChat();
	}

	$('.pop-up-text-closer').click(function(){
		$('.pop-up-container').toggle();
	})

	setTimeout(() => {
		$('.pop-up-container').slideToggle(150);
	}, 2000);


	// Session Init (is important so that each user interaction is unique)--------------------------------------
	var session = function() {
		// Retrieve the object from storage
		if(sessionStorage.getItem('session')) {
			var retrievedSession = sessionStorage.getItem('session');
		} else {
			// Random Number Generator
			var randomNo = Math.floor((Math.random() * 1000) + 1);
			// get Timestamp
			var timestamp = Date.now();
			// get Day
			var date = new Date();
			var weekday = new Array(7);
			weekday[0] = "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			var day = weekday[date.getDay()];
			// Join random number+day+timestamp
			var session_id = randomNo+day+timestamp;
			// Put the object into storage
			sessionStorage.setItem('session', session_id);
			var retrievedSession = sessionStorage.getItem('session');
		}
		return retrievedSession;
		// console.log('session: ', retrievedSession);
	}

	// Call Session init
	var mysession = session();


	// on input/text enter--------------------------------------------------------------------------------------
	$('#chat-input').on('keyup keypress', function(e) {
		var keyCode = e.keyCode || e.which;
		var text = $("#chat-input").val();
		if (keyCode === 13) {
			if(text == "" ||  $.trim(text) == '') {
				e.preventDefault();
				return false;
			} else {
				$("#chat-input").blur();
				setUserResponse(text);
				send(text);
				e.preventDefault();
				return false;
			}
		}
	});

	$("#send-button").click(function(e) {
    var text = $("#chat-input").val();
		if(text == "" ||  $.trim(text) == '') {
			e.preventDefault();
			return false;
		} else {
			$("#chat-input").blur();
			setUserResponse(text);
			send(text);
			e.preventDefault();
			return false;
		}
	});


	//------------------------------------------- Send request to API.AI ---------------------------------------
	function send(text) {
		$.ajax({
			type: "POST",
			url: baseUrl + "query?v=20150910",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + accessToken
			},
			data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
			success: function(data) {
				main(data);
				console.log(data);
			},
			error: function(e) {
				console.log (e);
			}
		});
	}


	//------------------------------------------- Main function ------------------------------------------------
	function main(data) {
		var action = data.result.action;
		var speech = data.result.fulfillment.speech;
		// use incomplete if u use required in api.ai questions in intent
		// check if actionIncomplete = false
		var incomplete = data.result.actionIncomplete;
		if(data.result.fulfillment.messages) { // check if messages are there
			if(data.result.fulfillment.messages.length > 0) { //check if quick replies are there
				var suggestions = data.result.fulfillment.messages[1];
			}
		}
		switch(action) {
			// case 'your.action': // set in api.ai
			// Perform operation/json api call based on action
			// Also check if (incomplete = false) if there are many required parameters in an intent
			// if(suggestions) { // check if quick replies are there in api.ai
			//   addSuggestion(suggestions);
			// }
			// break;
			default:
				setBotResponse(speech);
				if(suggestions) { // check if quick replies are there in api.ai
					addSuggestion(suggestions);
				}
				break;
		}
	}


	//------------------------------------ Set bot response in result_div -------------------------------------
	function setBotResponse(val) {
		sleep(1000);
		sleep(1000);
		setTimeout(function(){
			if($.trim(val) == '') {
				val = 'I couldn\'t get that. Let\' try something else!'
				var BotResponse = '<div class="scope-bot"><p class="botResult">'+val+'</p></div><div class="clearfix"></div>';
				$(BotResponse).appendTo('#result_div');	// Suggestions end -----------------------------------------------------------------------------------------
			} else {
				val = val.replace(new RegExp('\r?\n','g'), '<br />');
				var BotResponse = '<div class="scope-bot"><p class="botResult">'+val+'</p></div><div class="clearfix"></div>';
				$(BotResponse).appendTo('#result_div');
			}
			hideSpinner();
			scrollToBottomOfResults();
			if (window.innerWidth>600) document.getElementById('chat-input').focus();
		}, 500);
	}


	//------------------------------------- Set user response in result_div ------------------------------------
	function setUserResponse(val) {
		var UserResponse = '<div class="scope-user"><p class="userEnteredText">'+val+'</p></div><div class="clearfix"></div>';
		$(UserResponse).appendTo('#result_div');
		$("#chat-input").val('');
		scrollToBottomOfResults();
		$(".spinner").appendTo("#result_div");
		showSpinner();
		$('.suggestion').remove();
	}


	//---------------------------------- Scroll to the bottom of the results div -------------------------------
	function scrollToBottomOfResults() {
		var terminalResultsDiv = document.getElementById('result_div');
		terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
	}


	//---------------------------------------- Ascii Spinner ---------------------------------------------------
	function showSpinner() {
		$('.spinner').show();
	}
	function hideSpinner() {
		$('.spinner').hide();
	}

	//------------------------------------- Bot response retard ------------------------------------------------
	function sleep(milliseconds) {
  	var start = new Date().getTime();
  	for (var i = 0; i < 1e7; i++) {
    	if ((new Date().getTime() - start) > milliseconds){
      	break;
    	}
  	}
	}
});
