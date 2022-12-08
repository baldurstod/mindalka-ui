import {createElement, hide, show, display} from '../mindalka-html.js';

const resizeCallback = (entries, observer) => {
	entries.forEach(entry => {
		entry.target.onResized(entry);
	});
};

const DEFAULT_AUTO_PLAY_DELAY = 3000;
const DEFAULT_SCROLL_TRANSITION_TIME = 0.5;

export class MindalkaSlideshow extends HTMLElement {
	#activeImage;
	#currentImage;
	#doOnce;
	#doOnceOptions;
	#dynamic;
	#htmlControls;
	#htmlImages;
	#htmlImagesOuter;
	#htmlImagesInner;
	#htmlNextImage;
	#htmlPauseButton;
	#htmlPlayButton;
	#htmlPreviousImage;
	#htmlThumbnails;
	#htmlZoomContainer;
	#images;
	#imgSet;
	#htmlZoomImage;
	#resizeObserver = new ResizeObserver(resizeCallback);

	constructor(options) {
		super();
		this.#images = [];
		this.#dynamic = true;
		this.#imgSet = new Set();
		this.#currentImage = 0;
		this.#activeImage = null;
		this.#doOnce = true;
		this.#doOnceOptions = options;
		this.#initObserver();
	}

	#initHtml() {
		if (this.#dynamic) {
			this.classList.add('mindalka-slideshow-dynamic');
		}
		this.#htmlImages = createElement('div', {class:'mindalka-slideshow-images'});
		this.#htmlImagesOuter = createElement('div', {class:'mindalka-slideshow-images-outer'});
		this.#htmlImagesInner = createElement('div', {class:'mindalka-slideshow-images-inner'});
		this.#htmlImagesInner.addEventListener('mouseover', (event) => this.#zoomImage(event));
		this.#htmlImagesInner.addEventListener('mousemove', (event) => this.#zoomImage(event));
		this.#htmlImagesInner.addEventListener('mouseout', (event) => this.#zoomImage(event));
		this.#htmlControls = createElement('div', {class:'mindalka-slideshow-controls'});
		this.#htmlControls.addEventListener('mouseenter', (event) => this.#htmlControls.style.opacity = 'unset');
		this.#htmlControls.addEventListener('mouseleave', (event) => this.#htmlControls.style.opacity = '0');

		this.#htmlZoomImage = createElement('img');
		this.#htmlZoomContainer = createElement('div', {class:'mindalka-slideshow-zoom', childs:[this.#htmlZoomImage]});
		document.body.append(this.#htmlZoomContainer);

		this.#htmlThumbnails = createElement('div', {class:'mindalka-slideshow-thumbnails'});
		display(this.#htmlThumbnails, !this.#dynamic);
		display(this.#htmlControls, this.#dynamic);

		this.#htmlPreviousImage = createElement('div', {class:'mindalka-slideshow-previous-image'});
		this.#htmlNextImage = createElement('div', {class:'mindalka-slideshow-next-image'});

		this.#htmlPreviousImage.addEventListener('click', (event) => {this.previousImage();this.setAutoPlay(false);});
		this.#htmlNextImage.addEventListener('click', (event) => {this.nextImage();this.setAutoPlay(false);});

		this.#htmlPlayButton = createElement('div', {class:'mindalka-slideshow-play'});
		this.#htmlPauseButton = createElement('div', {class:'mindalka-slideshow-pause'});

		this.#htmlPlayButton.addEventListener('click', (event) => this.play(true));
		this.#htmlPauseButton.addEventListener('click', (event) => this.play(false));

		this.#htmlControls.append(this.#htmlPreviousImage, this.#htmlNextImage, this.#htmlPlayButton, this.#htmlPauseButton);
		this.#htmlImages.append(this.#htmlImagesOuter);
		this.#htmlImagesOuter.append(this.#htmlImagesInner);
		this.append(this.#htmlImages, this.#htmlControls, this.#htmlThumbnails);
	}

	previousImage() {
		if (this.#currentImage == 0) {
			this.setImage(this.#images.length - 1);
		} else {
			this.setImage(this.#currentImage - 1);
		}
	}

	nextImage() {
		if (this.#currentImage >= this.#images.length - 1) {
			this.setImage(0);
		} else {
			this.setImage(this.#currentImage + 1);
		}
	}

	setImage(imageId) {
		this.#currentImage = imageId;
		this.active = this.#images[imageId];
	}

	connectedCallback() {
		if (this.#doOnce) {
			this.#initHtml();
			this.processOptions(this.#doOnceOptions);
			this.#processChilds();
			this.#doOnce = false;
		}
		this.#resizeObserver.observe(this);
		this.checkImagesSize();
		document.body.append(this.#htmlZoomContainer);
	}

	disconnectedCallback() {
		if (this.#htmlZoomContainer) {
			this.#htmlZoomContainer.remove();
			hide(this.#htmlZoomContainer);
		}
	}

	addImage(htmlImage) {
		if (htmlImage.constructor.name == 'HTMLImageElement') {
			if (!this.#imgSet.has(htmlImage)) {
				this.#images.push(htmlImage);
				this.#imgSet.add(htmlImage);
				this.#htmlImagesInner.append(htmlImage);
				if (!this.#activeImage) {
					this.active = htmlImage;
				}
				htmlImage.classList.add('mindalka-slideshow-image');
				htmlImage.decode().then(() => {
					this.refresh();
				});

				//this.checkImageSize(htmlImage);
				htmlImage.onload = () => this.checkImageSize(htmlImage);

				let htmlThumbnailImage = htmlImage.cloneNode();
				this.#htmlThumbnails.append(htmlThumbnailImage);
				htmlThumbnailImage.addEventListener('click', () => this.active = htmlImage);
			}
		}
	}

	removeAllImages() {
		this.#images = [];
		this.#imgSet = new Set();
		this.#htmlImagesInner.innerHTML = '';
		this.#htmlThumbnails.innerHTML = '';
		this.#activeImage = null;
	}

	refresh() {
		for (let image of this.#images) {
			//image.style.display = (image ==  this.#activeImage) ? '' : 'none';
			image.style.display = '';
		}
	}

	processOptions(options = {}) {
		this.setAutoPlay(options.autoPlay ?? true);
		this.autoPlayDelay = options.autoPlayDelay ?? DEFAULT_AUTO_PLAY_DELAY;
		this.smoothScroll = options.smoothScroll ?? true;
		this.smoothScrollTransitionTime = options.smoothScrollTransitionTime ?? DEFAULT_SCROLL_TRANSITION_TIME;

		if (options.images) {
			for (let image of options.images) {
				let htmlImage = createElement('img');
				htmlImage.src = image;
				this.addImage(htmlImage);
			}
		}
		if (options.class) {
			this.className = options.class;
		}
		if (options.id) {
			this.id = options.id;
		}
	}

	#processChilds() {
		//This is a 2 steps process cause we may change DOM
		const children = this.children;
		let list = [];
		for (let child of children) {
			list.push(child);
		}
		list.forEach(element => this.addImage(element));
	}

	set active(htmlImage) {
		if (htmlImage) {
			this.#activeImage = htmlImage;
			this.refresh();
			this.checkImageSize(htmlImage);
			this.#htmlImagesInner.style.left = `-${htmlImage.offsetLeft}px`;
			this.play();
		}
	}

	set dynamic(dynamic) {
		this.#dynamic = dynamic;
		display(this.#htmlThumbnails, !dynamic);
		display(this.#htmlControls, dynamic);
		if (!dynamic) {
			this.setAutoPlay(false);
			this.setImage(0);
		}
		if (dynamic) {
			this.classList.add('mindalka-slideshow-dynamic');
		} else {
			this.classList.remove('mindalka-slideshow-dynamic');
		}
	}

	setAutoPlay(autoPlay) {
		this.autoPlay = autoPlay && this.#dynamic;
		if (autoPlay) {
			hide(this.#htmlPlayButton);
			show(this.#htmlPauseButton);
		} else {
			show(this.#htmlPlayButton);
			hide(this.#htmlPauseButton);
		}
	}

	play(autoPlay) {
		if (autoPlay !== undefined) {
			this.setAutoPlay(autoPlay);
		}

		clearTimeout(this.autoplayTimeout);
		if (this.autoPlay) {
			this.autoplayTimeout = setTimeout(() => this.nextImage(), this.autoPlayDelay);
		}
	}

	onResized(resizeObserverEntry) {
		this.checkImagesSize();
	}

	checkImagesSize() {
		let rect = this.#htmlImages.getBoundingClientRect();
		let widthRatio = 1.0;
		let heightRatio = 1.0;
		for (let image of this.#images) {
			this.checkImageSize(image, rect);
		}
	}

	checkImageSize(htmlImage, rect = this.#htmlImages.getBoundingClientRect()) {
		if (this.#activeImage != htmlImage) {
			return;
		}
		let widthRatio = 1.0;
		let heightRatio = 1.0;

		let naturalWidth = htmlImage.naturalWidth;
		let naturalHeight = htmlImage.naturalHeight;

		if (naturalWidth > rect.width) {
			widthRatio = rect.width / naturalWidth;
		}
		if (naturalHeight > rect.height) {
			heightRatio = rect.height / naturalHeight;
		}

		let ratio = Math.min(widthRatio, heightRatio);

		let imageWidth = naturalWidth * ratio + 'px';
		let imageHeight = naturalHeight * ratio + 'px';
		this.#htmlImagesOuter.style.width = imageWidth;
		this.#htmlImagesOuter.style.height = imageHeight;
		//this.#htmlImagesInner.style.transform = `scale(${1})`;

		//this.#htmlControls.style.width = imageWidth;
		//this.#htmlControls.style.height = imageHeight;
	}

	#zoomImage(event) {
		let activeImage = this.#activeImage;
		//console.log(event);
		//console.log(event.offsetX, event.offsetY);
		switch (event.type) {
			case 'mouseover':
				if (activeImage) {
					this.#htmlZoomImage.src = activeImage.src;
					show(this.#htmlZoomContainer);
				}
				break;
			case 'mousemove':
				if (activeImage) {

					let deltaWidth = this.#htmlZoomContainer.clientWidth - this.#htmlZoomImage.clientWidth;
					let deltaHeight = this.#htmlZoomContainer.clientHeight - this.#htmlZoomImage.clientHeight;

					let mouseX = event.offsetX / activeImage.offsetWidth - 0.5;
					let mouseY = event.offsetY / activeImage.offsetHeight - 0.5;

					/*if (deltaWidth >= 0) {
						this.#htmlZoomImage.style.left = `${-mouseX * deltaWidth}px`;
					} else {

					}
					if (deltaHeight >= 0) {
						this.#htmlZoomImage.style.top = `${-mouseY * deltaHeight}px`;
					}*/
					//console.log(deltaWidth, deltaHeight);
					//console.log(mouseX, mouseY);
					this.#htmlZoomImage.style.left = `${Math.sign(deltaWidth) * mouseX * deltaWidth}px`;
					this.#htmlZoomImage.style.top = `${Math.sign(deltaHeight) * mouseY * deltaHeight}px`;



					this.#htmlZoomImage.style.left = `${deltaWidth * 0.5 - Math.sign(deltaWidth) * mouseX * deltaWidth}px`;
					this.#htmlZoomImage.style.top = `${deltaHeight * 0.5 - Math.sign(deltaHeight) * mouseY * deltaHeight}px`;

				}
				break;
			case 'mouseout':
				hide(this.#htmlZoomContainer);
				break;
			default:

		}
	}

	#initObserver() {
		let config = {childList:true, subtree: true};
		const mutationCallback = (mutationsList, observer) => {
			for (const mutation of mutationsList) {
				let addedNodes = mutation.addedNodes;
				for (let addedNode of addedNodes) {
					if (addedNode.parentNode == this) {
						this.addImage(addedNode);
					}
				}
			}
		};

		let observer = new MutationObserver(mutationCallback);
		observer.observe(this, config);

	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'dynamic':
				this.dynamic = newValue == true;
				break;
		}
	}

	static get observedAttributes() {
		return ['dynamic'];
	}
}
