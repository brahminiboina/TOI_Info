		var googleUser = {};
		var email ; 
		var startApp = function() 
		{
			try
			{
				//renderButton();
				print_log("GSIGNIN : startApp");
				gapi.load('auth2', function()
				{
					// Retrieve the singleton for the GoogleAuth library and set up the client.
					auth2 = gapi.auth2.init({
					client_id: '248048816956-bep98nh7tb7jta47h10s1db03qbu8vhl.apps.googleusercontent.com',
					cookiepolicy: 'single_host_origin',
					// Request scopes in addition to 'profile' and 'email'
					//scope: 'additional_scope'
					});
					attachSignin(document.getElementById('gSignInWrapper'));
				});
								
			}
			catch(err) 
			{
				print_log("Error in startApp : err : "+err.message);
			} 

		};

		function attachSignin(element) 
		{
			try
			{
				//alert("attachSignin");
				print_log("GSIGNIN : attachSignin ");
				/*auth2.attachClickHandler(element, {},
					function(googleUser) 
					{
						print_log("googleUser.getBasicProfile().getName() : "+googleUser.getBasicProfile().getName());
						$('#customBtn').slideDown('slow');	
						document.getElementById('name').innerText = "Signed in: " + googleUser.getBasicProfile().getName();
					}, function(error) {
						print_log("GSIGNIN : error : "+error);
						print_log("GSIGNIN : error : "+JSON.stringify(error, undefined, 2));
						//alert(JSON.stringify(error, undefined, 2));
					});*/
					
				auth2.attachClickHandler(element, {}, onFirstSuccessSignIn, onFailure);
				auth2.isSignedIn.listen(signinChanged);
				auth2.currentUser.listen(userChanged); // This is what you use to listen for user changes
								
			}
			catch(err) 
			{
				print_log("Error in attachSignin : err : "+err.message);
			} 

		}
		
		var signinChanged = function (val) 
		{
			try
			{
				print_log('signinChanged: Signin state changed to '+ val);
				print_log('signinChanged: auth2.isSignedIn.get() '+ auth2.isSignedIn.get());
							
			}
			catch(err) 
			{
				print_log("Error in signinChanged : err : "+err.message);
			} 

		};

		var userChanged = function (val) 
		{
			try
			{
				print_log('user changed to '+val);
							
			}
			catch(err) 
			{
				print_log("Error in userChanged : err : "+err.message);
			} 

		};
		
		var userChanged = function (user) 
		{
			try
			{
				//alert('user changed to : user:'+user+' : user changed to : user.getId() :'+user.getId());
				print_log('user changed to : user:'+user+' : user changed to : user.getId() :'+user.getId());
				//print_log(' : user.getEmail:'+ user.getEmail());
				if(user.getId()){
				  // Do something here
				}
							
			}
			catch(err) 
			{
				print_log("Error in userChanged : err : "+err.message);
			} 

		};
		/*	var onSuccess = function(user) {
				print_log('Signed in as ' + user.getBasicProfile().getName());
				// Redirect somewhere
			};

			var onFailure = function(error) {
				print_log(error);
			};*/
			
		function print_log(log_str) 
		{
			console.log(log_str);
			postGoogleInfo(log_str);
		}
		
		function onFirstSuccessSignIn(googleUser) 
		{
			//alert("onFirstSuccessSignIn");
			var profile = googleUser.getBasicProfile();
			print_log("GSIGNIN : onFirstSuccessSignIn")
			printProfile(googleUser);
			var id_token = googleUser.getAuthResponse().id_token;
			
			user=profile.getEmail();
			email=user;
			user_id=profile.getId();
			user_url=profile.getImageUrl();
			givenName=profile.getGivenName();
			familyName=profile.getFamilyName();
			googletoken=id_token;
				
			//Display the user details
				var respResult = GetListItems(user);
				//alert("result : "+respResult);
				var listAppend = "";
				var respArr = JSON.parse(respResult);
				//alert("respArr length : "+respArr.length);
				for (i=0;i<respArr.length;i++){
					var respDataJSON = respArr[i];
					var name = respDataJSON["name"];
					var link = respDataJSON["link"];
					listAppend = '<div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href='+link+'?uid='+user+' target="_top">'+name+'</a></div></div>';
					
				}
						
						
				var profileHTML = ' <li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown"><span class="gb_bb gbii" ><img src="'+user_url+'" style="width: 32px; height: 32px;" ></span> </a><div class="dropdown-menu"><form class="form-horizontal" method="post" accept-charset="UTF-8"><div class="gb_sb gb_fa gb_g" aria-label="Account Information" aria-hidden="false" img-loaded="1"><div class="gb_wb"></a><div class="gb_yb"><div class="gb_Bb gb_Cb">'+givenName+'</div></div></div><div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href="javascript:void(0);" onclick="signOut();" target="_top">Sign out</a></div></div>'+listAppend+'</div></div></form</div></li>';
				$('.userContent').html(profileHTML);
				$('#gSignInWrapper').slideUp('slow');
				$('#loginId').slideUp('slow');
				
				submitPostWithGoogleToken(id_token);
				alert(idToken);
				
			//	postTokenInfo(id_token);
			//	location.href = window.location.search;
				
				
			//print_log("ID Token: " + id_token);
		/*	gapi.client.load('plus', 'v1', function () {
				var request = gapi.client.people.get({
					'userId': 'me'
				});
				//Display the user details
				request.execute(function (resp) {	
					print_log("gmail::"+resp.emails[0].value);
					//sendUserInfo();
					
					var respResult = GetListItems(user);
					//alert("result : "+respResult);
					var listAppend = "";
					var respArr = JSON.parse(respResult);
					//alert("respArr length : "+respArr.length);
					for (i=0;i<respArr.length;i++){
						var respDataJSON = respArr[i];
						var name = respDataJSON["name"];
						var link = respDataJSON["link"];
						listAppend = '<div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href='+link+'?uid='+user+' target="_top">'+name+'</a></div></div>';
						
					}
					
					var profileHTML = ' <li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown"><span class="gb_bb gbii" ><img src="'+resp.image.url+'" style="width: 32px; height: 32px;" ></span> </a><div class="dropdown-menu"><form class="form-horizontal" method="post" accept-charset="UTF-8"><div class="gb_sb gb_fa gb_g" aria-label="Account Information" aria-hidden="false" img-loaded="1"><div class="gb_wb"></a><div class="gb_yb"><div class="gb_Bb gb_Cb">'+resp.displayName+'</div></div></div><div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href="javascript:void(0);" onclick="signOut();" target="_top">Sign out</a></div></div>'+listAppend+'</div></div></form</div></li>';
					$('.userContent').html(profileHTML);
					$('#gSignInWrapper').slideUp('slow');
					$('#loginId').slideUp('slow');
					//<div class="gb_Ab gbip" title="Profile"><img src="'+resp.image.url+'"></div>
					//<div>'+resp.emails[0].value+'</div>
				});
				postTokenInfo(id_token);
				print_log("onFirstSuccessSignIn : Page gets refreshing")
				location.href = window.location.search;
			}); */
		}				
		function onSuccess(googleUser) 
		{
			try
			{
				//alert("onsuccess1");
				//alert("-----------------------");			
				var profile = googleUser.getBasicProfile();
				print_log("GSIGNIN : onSuccess")
				printProfile(googleUser);
				// The ID token you need to pass to your backend:
				var id_token = googleUser.getAuthResponse().id_token;
				//print_log("ID Token: " + id_token);
				user=profile.getEmail();
				email=user;
				user_id=profile.getId();
				user_url=profile.getImageUrl();
				givenName=profile.getGivenName();
				familyName=profile.getFamilyName();
				googletoken=id_token;
				
				//Display the user details
				var respResult = GetListItems(user);
				//alert("result : "+respResult);
				var listAppend = "";
				var respArr = JSON.parse(respResult);
				//alert("respArr length : "+respArr.length);
				for (i=0;i<respArr.length;i++){
					var respDataJSON = respArr[i];
					var name = respDataJSON["name"];
					var link = respDataJSON["link"];
					listAppend = '<div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href='+link+'?uid='+user+' target="_top">'+name+'</a></div></div>';
					
				}
						
						
				var profileHTML = ' <li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown"><span class="gb_bb gbii" ><img src="'+user_url+'" style="width: 32px; height: 32px;" ></span> </a><div class="dropdown-menu"><form class="form-horizontal" method="post" accept-charset="UTF-8"><div class="gb_sb gb_fa gb_g" aria-label="Account Information" aria-hidden="false" img-loaded="1"><div class="gb_wb"></a><div class="gb_yb"><div class="gb_Bb gb_Cb">'+givenName+'</div></div></div><div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href="javascript:void(0);" onclick="signOut();" target="_top">Sign out</a></div></div>'+listAppend+'</div></div></form</div></li>';
				$('.userContent').html(profileHTML);
				$('#gSignInWrapper').slideUp('slow');
				$('#loginId').slideUp('slow');
				
			//	postTokenInfo(id_token);
				
				
						
				//alert("user_id : "+user);
				gapi.client.load('plus', 'v1', function () {
					var request = gapi.client.plus.people.get({
						'userId': 'me'
					});
					//Display the user details
					var respResult = GetListItems(user);
						//alert("result : "+respResult);
						var listAppend = "";
						var respArr = JSON.parse(respResult);
						//alert("respArr length : "+respArr.length);
						for (i=0;i<respArr.length;i++){
							var respDataJSON = respArr[i];
							var name = respDataJSON["name"];
							var link = respDataJSON["link"];
							listAppend = '<div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href='+link+'?uid='+user+' target="_top">'+name+'</a></div></div>';
							
						}
						
					request.execute(function (resp) {	
						//print_log("gmail::"+resp.emails[0].value);
						//sendUserInfo();
						
						
						
						var profileHTML = ' <li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown"><span class="gb_bb gbii" ><img src="'+resp.image.url+'" style="width: 32px; height: 32px;" ></span> </a><div class="dropdown-menu"><form class="form-horizontal" method="post" accept-charset="UTF-8"><div class="gb_sb gb_fa gb_g" aria-label="Account Information" aria-hidden="false" img-loaded="1"><div class="gb_wb"></a><div class="gb_yb"><div class="gb_Bb gb_Cb">'+resp.displayName+'</div></div></div><div class="gb_Fb"><div></div> <div><a class="gb_Fa gb_Pf gb_Wf gb_Ee gb_Eb" id="gb_71" href="javascript:void(0);" onclick="signOut();" target="_top">Sign out</a></div></div>'+listAppend+'</div></div></form</div></li>';
						$('.userContent').html(profileHTML);
						$('#gSignInWrapper').slideUp('slow');
						$('#loginId').slideUp('slow');
						//<div class="gb_Ab gbip" title="Profile"><img src="'+resp.image.url+'"></div>
						//<div>'+resp.emails[0].value+'</div>
					});
				//	postTokenInfo(id_token);
				});
							
			}
			catch(err) 
			{
				print_log("Error in onsuccess : err : "+err.message);
			} 
	
		}		
		
		function GetListItems(user_id){
				var response = "";
				try {
					//http://dev.wicore.in/wiapp/GetMenuListAPI?uid=nanowicore2019@gmail.com&cust_id=10&sid=7
					var urlstr = "/wiapp/GetMenuListAPI?uid="+user_id+"&cust_id=10&sid=7";
						console.log("GetListItems | urlstr - "+urlstr);
						//var qsParams = qs+"&he_flag=Y";
						jQuery.ajax({
							url:urlstr ,
							method: 'GET',
							success: function (result) {
								response = result;
								//alert("Response : "+response);
							},
							async: false
						});
				} catch (err) {
					//alert("Error from TPay HE confirm : "+err);
					console.log("Exception while storing click : "+err.message);
				}
				return response;
		}
			
			
		
		function printProfile(googleUser) 
		{
			var profile = googleUser.getBasicProfile();
			var id_token = googleUser.getAuthResponse().id_token;
			//+profile
			print_log("GSIGNIN : printProfile   -------------  ID: " + profile.getId()+ " : Full Name: ' + profile.getName() " + " : Given Name: " + profile.getGivenName() + " Email: " + profile.getEmail());
			// + "ID Token: " + id_token
			
		}
		
		function onFailure(error) 
		{
			try
			{
				//alert("onfailure");
				//alert(error+" :: testing");
				print_log("onFailure : error : "+error+" : error.message : "+error.message+" : error.val : "+error.val);
			}
			catch(err) 
			{
				print_log("Error in onFailure : err : "+err.message);
			} 
		}
		
		//submitPostWithGoogleToken(idToken), method implementation.
	function submitPostWithGoogleToken(idToken){
			//print_log("entered into form: " +idToken);
			
			var form = document.createElement("form"); 
			form.setAttribute("method", "POST");
			form.setAttribute("action", "/wiapp/index");
			
			var inputEle = document.createElement("input");
			inputEle.setAttribute("type", "hidden");
			inputEle.setAttribute("name", "idToken");
			inputEle.setAttribute("id", "idToken");
			inputEle.setAttribute("value", idToken);
			//print_log("entered into inputEle: " +inputEle+ " form: " +form);
			form.appendChild(inputEle);
			document.body.appendChild(form);
			form.submit();
		}
		
		
		function postTokenInfo(id_token) 
		{
			try 
			{
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/wiapp/google/ValidateAuth',false);
				//xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				/*xhr.onload = function() {
				  print_log('Signed in as: ' + xhr.responseText);
				};*/
				
				xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xhr.send(JSON.stringify({ "idToken": id_token}));
				//xhr.send('idtoken=' + id_token);

				/* $.ajax({
					type: 		"post",
					url: 		"/wiapp/google/ValidateAuth",
					success:	function(data)
							{
								//print_log('ENTERED INTO AJAX);
								location.href = window.location.search;

							}
					}); */
				
			}
			catch(err) 
			{
				print_log("Error in postTokenInfo : err : "+err.message);
			} 
		}
		
	
		function renderButton() 
		{
			try
			{
				print_log("GSIGNIN : renderButton");
				gapi.signin2.render('gSignInWrapper', {
				'scope': 'profile email',
				'width': 240,
				'height': 60,
				'longtitle': true,
				'theme': 'dark',
				'onsuccess': onSuccess,
				'onfailure': onFailure
				});
				//print_log("GSIGNIN : renderButton End");
			}
			catch(err) 
			{
				print_log("Error in renderButton : err : "+err.message);
			} 
		}
	
	function signOut() 
	{
		try
		{
			
			print_log("google_sign_out : signOut")
			print_log("google_sign_out : googleUser : "+googleUser)
				
			//var auth2 = gapi.auth2.getAuthInstance();
			//print_log("google_sign_out : id_token : "+auth2)
			
			auth2.signOut().then(function () {
				$('.userContent').html('');
				$('#gSignInWrapper').slideDown('slow');
				$('#loginId').slideDown('slow');
			});
			//auth2.disconnect();
			//sessionStorage.clear();
			postLogoutInfo();
			//alert("PostLogInfoooooooooooooooooooooooooooooooooo");
			document.cookie = "wiapp_google_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=.wicore.in";
			document.cookie = "wiappid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=.wicore.in";
			//alert("Location href : "+window.location.search);
			location.href = window.location.search;
					
		}
		catch(err) 
		{
			print_log("Error in signOut : err : "+err.message);
		} 

	}
	
	function postLogoutInfo() 
	{
		try 
		{
			print_log("email : "+email);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/wiapp/google/LogoutInfo');
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(JSON.stringify({ "email": email}));
			//xhr.send('idtoken=' + id_token);
			
		}
		catch(err) 
		{
			print_log("Error in postLogoutInfo : err : "+err.message);
		} 
	}
	
	function postGoogleInfo(info)
	{
		try
		{
			var xhr = new XMLHttpRequest();
			var uri = encodeURI('email='+email+'&info='+info);
			xhr.open('GET', '/wiapp/google/Info?'+uri);
			//xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			//xhr.send(JSON.stringify({ "info": info,"email": email}));			
			xhr.onload = function() {
			  //console.log(xhr.response);
			};
			xhr.send();			
		}
		catch(err) 
		{
			print_log("Error in postGoogleInfo : err : "+err.message);
		} 
	}