/* Retrieves the data for a given post (shortcode) */
function getPostInfo(shortcode){
	return new Promise(
		function(resolve, reject){
      var Http = new XMLHttpRequest();
			/* This request doesn't require credentials. The info and endpoint are public*/
			Http.open(
				"GET",
				IG_QUERY_SERVER + '?query_hash=' + QH_POSTS +
				'&variables={"shortcode":"' + shortcode +
				'","child_comment_count":0,"fetch_comment_count":0,"parent_comment_count":0,"has_threaded_comments":false}'
			);
			Http.send();
			Http.onreadystatechange = function() {
				if(this.readyState == 4){
					if(this.status == 200){
						var response = JSON.parse(Http.responseText);
            // Returns an object with the post's data:
						resolve(response.data.shortcode_media);
					}
					else{
						reject(
              'Error while getting post\'s data:\n' +
              'Instagram server responded with and error code: ' +
              this.status + '.'
            );
					}
				}
			}
		}
	);
}

/* Sets the fullscreen functionality of a given button */
function fullscreenAction(button){
  // Checks if the direct media URL has been previously loaded:
  if(button.parentNode.dataset.mediaurl != undefined){
    // Triggers the player:
    switch (button.parentNode.dataset.mediatype){
      case 'video':
        // Displays a picture:
        mediaViewer.playVideo(button.parentNode.dataset.mediaurl);
        break;
      case 'image':
        // Displays a video:
        mediaViewer.showPicture(button.parentNode.dataset.mediaurl);
        break;
      default:
    }
  }
  else{
    // In case that the direct media URL is not ready, it loads it:
    getPostInfo(button.parentNode.dataset.shortcode).then(
      function(post){
        // The post is a video:
        if(post.is_video){
          button.parentNode.setAttribute(
            'data-mediatype',
            'video'
          );
          button.parentNode.setAttribute(
            'data-mediaurl',
            post.video_url
          );

          mediaViewer.playVideo(button.parentNode.dataset.mediaurl);
        }
        // The post is an image:
        else{
          button.parentNode.setAttribute(
            'data-mediatype',
            'image'
          );
          button.parentNode.setAttribute(
            'data-mediaurl',
            /* Sets data-mediaurl to the URL of the last display resource available
            (thus, the one with the highest resolution): */
            post.display_resources[
              post.display_resources.length - 1
            ].src
          );

          mediaViewer.showPicture(button.parentNode.dataset.mediaurl);
        }
      }
    ).catch(
      function(error){
        alert(error);
      }
    );
  }
}

/* Gets the byte stream of a given media */
function downloadMedia(URL){
	return new Promise(
		function(resolve, reject){
      var Http = new XMLHttpRequest();
			/* This request doesn't require credentials. The info and endpoint is public*/
			Http.open(
				"GET", URL);
			Http.send();
			Http.responseType = 'blob';
			Http.onreadystatechange = function() {
				if(this.readyState == 4){
					if(this.status == 200){
						resolve(Http.response);
					}
					else{
						reject(
              'Error while getting media:\n' +
              'Instagram server responded with and error code: ' +
              this.status + '.'
            );
					}
				}
			}
		}
	);
}

/* Sets the download functionality of a given button */
function downloadAction(button){
  var a = document.createElement('a');
  // Checks if the direct media URL has been previously loaded:
  if(button.parentNode.dataset.mediaurl != undefined){
    // Gets the BLOB data of the media:
    downloadMedia(button.parentNode.dataset.mediaurl).then(
      function(rawData){
        // Creates a download link:
        a.href = URL.createObjectURL(rawData);
        // The default file name will be the post's shortcode:
        a.download = button.parentNode.dataset.shortcode;
        // Downloads data:
        a.click();
      }
    ).catch(
      function(error){
        alert(error);
      }
    );
  }
  else{
    // In case that the direct media URL is not ready, it loads it:
    getPostInfo(button.parentNode.dataset.shortcode).then(
      function(post){
        // The post is a vide:
        if(post.is_video){
          button.parentNode.setAttribute(
            'data-mediaurl',
            post.video_url
          );
        }
        // The post is an image:
        else{
          button.parentNode.setAttribute(
            'data-mediaurl',
            /* Sets data-mediaurl to the URL of the last display resource available
            (thus, the one with the highest resolution): */
            post.display_resources[
              post.display_resources.length - 1
            ].src
          );
        }

        downloadMedia(button.parentNode.dataset.mediaurl).then(
          function(rawData){
            a.href = URL.createObjectURL(rawData);
            a.download = button.parentNode.dataset.shortcode;
            a.click();
          }
        ).catch(
          function(error){
            alert(error);
          }
        );
      }
    ).catch(
      function(error){
        alert(error);
      }
    );
  }
}

/* Renders toolbar (download and fullscreen buttons) for each post */
function renderPostControls(){
  // Gets all the posts of the current page:
  var posts = document.getElementsByClassName(DOM_POST_PREVIEW_CONTAINER_CLASS);
  var toolbars = []; // All posts toolbars handler

  for(var i = 0; i < posts.length; i++){ // For every post in the current page
    // If the post has no toolbar, add it
    if( !posts[i].classList.contains(DOM_POST_TOOLBAR_CONTAINER) ){
      // Gets post's shortcode:
      shortcode = posts[i].childNodes[0].href.match(REGEX_POST_URL)[1];

      // Creates the toolbar and adds it to toolbars handler:
      toolbars.push( document.createElement('div') );
        // Saves corresponding shortcode into toolbar's dataset:
      toolbars[ toolbars.length - 1 ].setAttribute('data-shortcode', shortcode);
      toolbars[ toolbars.length - 1 ].className = DOM_POST_TOOLBAR_ClASS;

        // Creates toolbar's buttons:
      toolbars[ toolbars.length - 1 ].appendChild( document.createElement('div') );
			toolbars[ toolbars.length - 1 ].appendChild( document.createElement('div') );

        // Adds fullscreen button functionality:
      toolbars[ toolbars.length - 1 ].childNodes[0].onclick = function(){
        fullscreenAction(this);
      };

        // Adds download button functionality:
      toolbars[ toolbars.length - 1 ].childNodes[1].onclick = function(){
        downloadAction(this);
      };

        // Fullscreen button icon:
      toolbars[ toolbars.length - 1 ].childNodes[0].appendChild(
				document.createElement('img')
			);
        // Download button icon:
			toolbars[ toolbars.length - 1 ].childNodes[1].appendChild(
				document.createElement('img')
			);

        // Toolbar's buttons setup:
      toolbars[ toolbars.length - 1 ].childNodes[0].childNodes[0].className = DOM_POST_FULLSCREEN_BUTTON_CLASS;
			toolbars[ toolbars.length - 1 ].childNodes[1].childNodes[0].className = DOM_POST_DOWNLOAD_BUTTON_CLASS;
			toolbars[ toolbars.length - 1 ].childNodes[0].childNodes[0].title = chrome.i18n.getMessage("postToolbarFullscreen");
			toolbars[ toolbars.length - 1 ].childNodes[1].childNodes[0].title = chrome.i18n.getMessage('postToolbarDownload');
			toolbars[ toolbars.length - 1 ].childNodes[0].childNodes[0].src = IG_URL + IG_SPRITESA_PATH;
			toolbars[ toolbars.length - 1 ].childNodes[1].childNodes[0].src = IG_URL + IG_SPRITESA_PATH;

      // Injects toolbar to the post:
			posts[i].insertBefore(toolbars[ toolbars.length - 1 ], posts[i].childNodes[0]);
			posts[i].classList.add(DOM_POST_TOOLBAR_CONTAINER);
    }
  }
}
