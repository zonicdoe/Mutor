/*-----------------------------------------------------------------------------
  The controler for the modal in which some content is shown.
-----------------------------------------------------------------------------*/
class modal{
	constructor(overlayID, modalID){
		this.overlayID = overlayID;
		this.modalID = modalID;
	}

	show(){
    this.modal.style.display = 'inline-block';
		this.overlay.style.width = '100%';
		this.overlay.style.opacity = 1;
	}

	hide(){
    var video = document.getElementById('mdl-video');
    if(video != null && video != undefined){
      video.pause();
    }
		this.overlay.style.opacity = 0;
		var that = this;
		setTimeout(
			function(){
        that.modal.style.display = 'none';
				that.overlay.style.width = '0%';
			}, 1000
		);
	}

	insertVideo(URL){
		var closeControl = document.createElement('div');
		var controls = document.createElement('div');
		var video = document.createElement('video');
	  var mediaContainer = document.createElement("div");
		var that = this;

		this.video = {
			play(){
				var video = document.getElementById('mdl-video');
				video.play();
			}
		};

		this.modal.innerHTML = '';

		closeControl.onclick = function(){
			that.hide();
		};
		closeControl.appendChild( document.createElement('img') );
		closeControl.childNodes[0].src = IG_URL + IG_SPRITESB_PATH;

		controls.className = 'modal-controls';

		video.id = 'mdl-video';
		video.controls = true;
		video.autoplay = true;
		video.src = URL;

		mediaContainer.className = 'media-container';

		controls.appendChild(closeControl);
		mediaContainer.appendChild(controls);
		mediaContainer.appendChild(video);

		this.modal.appendChild(mediaContainer);
	}

	insertPicture(URL){
		var closeControl = document.createElement('div');
		var controls = document.createElement('div');
		var picture = document.createElement('img');
	  var mediaContainer = document.createElement("div");
		var that = this;

		this.modal.innerHTML = '';

		closeControl.onclick = function(){
			that.hide();
		};
		closeControl.appendChild( document.createElement('img') );
		closeControl.childNodes[0].src = IG_URL + IG_SPRITESB_PATH;

		controls.className = 'modal-controls';

		picture.src = URL;
		picture.onload = function(){
			mediaViewer.show();
		};

		mediaContainer.className = 'media-container';

		controls.appendChild(closeControl);
		mediaContainer.appendChild(controls);
		mediaContainer.appendChild(picture);

		this.modal.appendChild(mediaContainer);
	}

	playVideo(URL){
    var that = this;

		this.overlay = document.getElementById(this.overlayID);
		this.modal = document.getElementById(this.modalID);
		this.insertVideo(URL);
		this.show();
		setTimeout(
			function(){
				that.video.play();
			}, 1000
		);
	}

	showPicture(URL){
		this.overlay = document.getElementById(this.overlayID);
		this.modal = document.getElementById(this.modalID);
		this.insertPicture(URL);
		//this.show();
	}

	insertWeb(URL){
		var closeControl = document.createElement('div');
		var controls = document.createElement('div');
	  var mediaContainer = document.createElement('div');
		var frame = document.createElement('iframe');
		var that = this;

		frame.src = URL;

		this.modal.innerHTML = '';

		closeControl.onclick = function(){
			updateUnseenDMCount();
			that.hide();
		};
		closeControl.appendChild( document.createElement('img') );
		closeControl.childNodes[0].src = IG_URL + IG_SPRITESB_PATH;

		controls.className = 'modal-controls';
		mediaContainer.className = 'media-container';

		controls.appendChild(closeControl);
		mediaContainer.appendChild(controls);

		mediaContainer.appendChild(frame);

		this.modal.appendChild(mediaContainer);
	}

	loadWeb(URL){
		this.overlay = document.getElementById(this.overlayID);
		this.modal = document.getElementById(this.modalID);
		this.insertWeb(URL);
		this.modal.style.display = 'inline-block';
		this.overlay.style.width = '100%';
		this.overlay.style.opacity = 1;
	}
}
