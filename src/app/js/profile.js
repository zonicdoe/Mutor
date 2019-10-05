// Last profile visited:
var cachedProfile = new user();
var loggedUser = new user();

/* Mutation observer for new media loading */
function hookMediaContainer(){
  // Media main container handler:
  var mediaContainer = document.getElementsByClassName(DOM_MEDIA_CONTAINER_CLASS)[0];
  if(mediaContainer != null){
    const mediaContainerObserver = new MutationObserver(
      function(mutations){
        if(mutations.length > 1){
          console.log('Media has been fetched.');
          // Renders toolbar for new loaded posts:
          renderPostControls(); // At posts.js
        }
      }
    );
    mediaContainerObserver.observe( mediaContainer, {childList: true, subtree: true} );
  }
}

/* Gets profile's bussiness info if available: */
function getBussinesInfo(userID){
	return new Promise(
		function(resolve, reject){
      chrome.runtime.sendMessage({command: MSG_GET_BUSINESS_INFO, userID: userID},
        function(response){
          if(response.status == 1){
            resolve(response.data);
          }
          else{
            reject(response.message);
          }
        }
      );
		}
	);
}

/*-----------------------------------------------------------------------------
  (Promise)
  Get basic Instagram user's info.
  @param    username  {string}  A valid instagram username

  @returns            {string}  An object containing all user's data.
  Object structure:
  {
    biography
    blocked_by_viewer
    edge_follow.count
    edge_followed_by.count
    followed_by_viewer
    full_name
    has_blocked_viewer
    has_channel
    id
    is_private
    is_verified
    profile_pic_url
    profile_pic_url_hd
    username
  }
-----------------------------------------------------------------------------*/
function getInstagramForeignUserData(username){
	return new Promise(
		function(resolve, reject){
      var Http = new XMLHttpRequest();
			Http.open("GET", IG_URL + username + '/?__a=1');
      Http.withCredentials = true;
			Http.send();
			Http.onreadystatechange = function() {
				if(this.readyState == 4){
					if(this.status == 200){
						var response = JSON.parse(Http.responseText);
						// graphql.user
            if(response.graphql != undefined){
              resolve(response.graphql.user);
            }
            else{
              reject(
                'Error while getting user\'s profile data:\n' +
                'Instagram server response was ok, but the user\'s data couldn\'t been found.\n' +
                'Are you sure this is a valid Instagram username? -> ' + username
              );
            }
					}
					else{
						reject(
              'Error while getting user\'s profile data:\n' +
              'Instagram server responded with and error code: ' +
              this.status + '.'
            );
					}
				}
			}
		}
	);
}

function updateCachedProfile(username){
  return new Promise(
    function(resolve, reject){
      cachedProfile.userData.username = username;
      getInstagramForeignUserData(username).then(
        function(userData){
          cachedProfile.userData.id = userData.id;
          cachedProfile.userData.full_name = userData.full_name;
          cachedProfile.userData.follows_viewer = userData.follows_viewer;
          cachedProfile.userData.is_business_account = userData.is_business_account;

          getBussinesInfo(userData.id).then(
            function(user){
              cachedProfile.userData.avatar = user.hd_profile_pic_url_info.url;
              cachedProfile.userData.address.street = user.address_street;
              cachedProfile.userData.address.city_name = user.city_name;
              cachedProfile.userData.address.zip = user.zip;
              cachedProfile.userData.contact_phone_number = user.contact_phone_number;
              cachedProfile.userData.public_email = user.public_email;
              cachedProfile.userData.category = user.category;
              resolve();
            }
          ).catch(
            function(error){
              console.log(error);
            }
          );
        }
      ).catch(
        function(error){
          reject(error);
        }
      );

    }
  );
}

function renderBusinessControls(profile){
  var DOMUserInfoContainer = document.getElementsByClassName(DOM_USER_INFO_CONTAINER_CLASS)[0];
  var address = '';
  var contacInfo;

  // user.address_street
  var streetNotEmpty = profile.userData.address.street !== null && profile.userData.address.street !== '';
  var cityNotEmpty = profile.userData.address.city_name !== null && profile.userData.address.city_name !== '';
  var zipNotEmpty = profile.userData.address.zip !== null && profile.userData.address.zip !== '';

  address += streetNotEmpty ? profile.userData.address.street : '';
  address += streetNotEmpty && cityNotEmpty ? ', ' : '';
  address += cityNotEmpty ? profile.userData.address.city_name : '';
  address += zipNotEmpty ? ' ' + profile.userData.address.zip : '';

  if(address != ''){
    var DOMaddress = document.createElement('a');
    DOMaddress.href = G_MAPS_QUERY_URL + encodeURI(address);
    DOMaddress.target = '_blank';
    DOMaddress.innerText = address;
    if(document.getElementsByClassName(DOM_MUTUAL_ONLY_CONTAINER_CLASS)[0] != null){
      DOMUserInfoContainer.insertBefore( DOMaddress, document.getElementsByClassName(DOM_MUTUAL_ONLY_CONTAINER_CLASS)[0] );
    }
    else{
      DOMUserInfoContainer.appendChild(DOMaddress);
    }
  }

  if(
    profile.userData.contact_phone_number !== null && profile.userData.contact_phone_number !== '' ||
    profile.userData.public_email !== null && profile.userData.public_email !== ''
  ){
    contacInfo = document.createElement('div');
    contacInfo.className = DOM_CONTAC_INFO_CLASS;
    if(profile.userData.contact_phone_number !== null && profile.userData.contact_phone_number !== ''){
      contacInfo.appendChild( document.createElement('a') );
      contacInfo.childNodes[0].href = 'tel:' + profile.userData.contact_phone_number;
      contacInfo.childNodes[0].innerText = profile.userData.contact_phone_number;
    }
    if(profile.userData.public_email !== null && profile.userData.public_email !== ''){
      contacInfo.appendChild( document.createElement('a') );
      contacInfo.lastChild.href = 'mailto:' + profile.userData.public_email;
      contacInfo.lastChild.innerText = profile.userData.public_email;
    }
    if(document.getElementsByClassName(DOM_MUTUAL_ONLY_CONTAINER_CLASS)[0] != null){
      DOMUserInfoContainer.insertBefore( contacInfo, document.getElementsByClassName(DOM_MUTUAL_ONLY_CONTAINER_CLASS)[0] );
    }
    else{
      DOMUserInfoContainer.appendChild(contacInfo);
    }
  }

  if(profile.userData.category !== null && profile.userData.category !== ''){
    var DOMAccountType = document.createElement('span');
    DOMAccountType.className = DOM_ACCOUNT_TYPE_CLASS;
    DOMAccountType.innerText = profile.userData.category;
    if( document.getElementsByClassName(DOM_FULL_NAME_CONTAINER_CLASS)[0] != undefined ){
      var DOMFullNameContainer = document.getElementsByClassName(DOM_FULL_NAME_CONTAINER_CLASS)[0];
      if(DOMFullNameContainer.nextSibling != undefined){
        DOMUserInfoContainer.insertBefore(
          DOMAccountType,
          document.getElementsByClassName(DOM_FULL_NAME_CONTAINER_CLASS)[0].nextSibling
        );
      }
      else{
        DOMUserInfoContainer.appendChild(DOMAccountType);
      }
    }
    else{
      DOMUserInfoContainer.prepend(DOMAccountType);
    }
  }
}

function injectProfileControls(avatarURL){
  var dom_username_container = document.getElementsByClassName(DOM_USERNAME_CONTAINER_CLASS)[0];
  var avatarContainer = document.getElementsByClassName(DOM_AVATAR_CONTAINER_CLASS)[0];

  /* Injects custom controls.
		 Position: avatar	*/
	avatarContainer.prepend(document.createElement('div'));
	avatarContainer.childNodes[0].className = DOM_AVATAR_OVERLAY_CLASS;
	avatarContainer.childNodes[0].appendChild( document.createElement('div') );
	avatarContainer.childNodes[0].childNodes[0].className = DOM_AVATAR_TOOLBAR_CLASS;
	avatarContainer.childNodes[0].childNodes[0].appendChild( document.createElement('div') );
	avatarContainer.childNodes[0].childNodes[0].appendChild( document.createElement('div') );
	avatarContainer.childNodes[0].childNodes[0].childNodes[0].appendChild( document.createElement('img') );
	avatarContainer.childNodes[0].childNodes[0].childNodes[1].appendChild( document.createElement('img') );
	avatarContainer.childNodes[0].childNodes[0].childNodes[0].childNodes[0].src = IG_URL + IG_SPRITESB_PATH;
	avatarContainer.childNodes[0].childNodes[0].childNodes[0].childNodes[0].title = chrome.i18n.getMessage("avatarToolbarFullscreen");
	avatarContainer.childNodes[0].childNodes[0].childNodes[0].childNodes[0].className = DOM_AVATAR_CONTROL_FULL_CLASS;
	avatarContainer.childNodes[0].childNodes[0].childNodes[1].childNodes[0].src = IG_URL + IG_SPRITESB_PATH;
	avatarContainer.childNodes[0].childNodes[0].childNodes[1].childNodes[0].className = DOM_AVATAR_CONTROL_INCOGNITO_CLASS;

  avatarContainer.childNodes[0].childNodes[0].childNodes[0].onclick = function(){
		mediaViewer.showPicture(avatarURL);
	};

	if(config.incognitoMode){
		avatarContainer.childNodes[0].childNodes[0].childNodes[1].childNodes[0].classList.add('green');
		avatarContainer.childNodes[0].childNodes[0].childNodes[1].childNodes[0].title = chrome.i18n.getMessage("avatarToolbarIncognitoActive");
	}
	else{
		avatarContainer.childNodes[0].childNodes[0].childNodes[1].childNodes[0].classList.add('red');
		avatarContainer.childNodes[0].childNodes[0].childNodes[1].childNodes[0].title = chrome.i18n.getMessage("avatarToolbarIncognitoDisabled");
	}

  if(config.unprotected){
		document.getElementsByClassName(DOM_AVATAR_OVERLAY_CLASS)[0].style.height = '0px';
	}

  /* Posts functionality: */
  injectMediaViewer(); // At loader.js
  renderPostControls(); // At posts.js
}

/* Injects code for the controls in the profile page */
function renderProfileControls(){
  var dom_username_container = document.getElementsByClassName(DOM_USERNAME_CONTAINER_CLASS)[0];
  var avatarContainer = document.getElementsByClassName(DOM_AVATAR_CONTAINER_CLASS)[0];

  // If the current page doesn't correspond to the logeed in user:
  if(dom_username_container.childNodes[0].innerText != loggedUser.userData.username){
    // If the current page doesn't correspond to the chached user
    if(dom_username_container.childNodes[0].innerText != cachedProfile.userData.username){
      // It's another user, loads the profile data:
      console.log('Loading profile.');
      updateCachedProfile(dom_username_container.childNodes[0].innerText).then(
        function(){
          injectProfileControls(cachedProfile.userData.avatar);
          if(cachedProfile.userData.is_business_account){
            renderBusinessControls(cachedProfile);
          }
        }
      ).catch(
        function(error){
          console.log(error);
        }
      );
    }
    else{
      // It's the same user, using cache:
      console.log('Cached user.');
      injectProfileControls(cachedProfile.userData.avatar);
      if(cachedProfile.userData.is_business_account){
        renderBusinessControls(cachedProfile);
      }
    }
  }
  else{
    // It's the logged in user, using personal data:
    console.log('Logged user profile.');
    if(loggedUser.userData.avatar == undefined){
      setTimeout(
        function(){
          getBussinesInfo(loggedUser.userData.id).then(
        		function(user){
        			loggedUser.userData.avatar = user.hd_profile_pic_url_info.url;
        			loggedUser.userData.address.street = user.address_street;
        			loggedUser.userData.address.city_name = user.city_name;
        			loggedUser.userData.address.zip = user.zip;
        			loggedUser.userData.contact_phone_number = user.contact_phone_number;
        			loggedUser.userData.public_email = user.public_email;
        			loggedUser.userData.category = user.category;
              injectProfileControls(loggedUser.userData.avatar);
              renderBusinessControls(loggedUser);
        		}
        	).catch(
        		function(error){
        			console.log(error);
        		}
        	);
        }, 500
      );
    }
    else{
      injectProfileControls(loggedUser.userData.avatar);
      renderBusinessControls(loggedUser);
    }
  }
}
