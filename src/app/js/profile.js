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

/* Injects code for the controls in the profile page */
function renderProfileControls(){
  //var dom_username_container = document.getElementsByClassName(DOM_USERNAME_CONTAINER_CLASS)[0];
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
		mediaViewer.showPicture("none");
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
