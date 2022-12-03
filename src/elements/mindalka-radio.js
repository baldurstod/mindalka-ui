import {createElement, hide, show, display} from '../mindalka-html.js';

export class MindalkaRadio extends HTMLElement {
	#doOnce;
	#disabled;
	#multiple = false;
	#htmlLabel;
	#state = false;
	#current;
	#buttons = new Map();
	#buttons2 = new Set();
	#selected = new Set();
	constructor(options) {
		super();
		this.#doOnce = true;
		this.#htmlLabel = createElement('div', {class: 'mindalka-radio-label'});
		this.#initObserver();
	}

	connectedCallback() {
		if (this.#doOnce) {
			this.prepend(this.#htmlLabel);
			hide(this.#htmlLabel);
			this.#processChilds();
			this.#doOnce = false;
		}
	}

	#processChilds() {
		for (let child of this.children) {
			this.#initButton(child);
		}
	}

	#initButton(htmlButton) {
		this.#buttons.set(htmlButton.value, htmlButton);
		if (!this.#buttons2.has(htmlButton)) {
			htmlButton.addEventListener('click', () => this.select(htmlButton.value, !this.#multiple || !htmlButton.hasAttribute('selected')));
			this.#buttons2.add(htmlButton);
		}

		if (this.#selected.has(htmlButton.value) || htmlButton.hasAttribute('selected')) {
			this.select(htmlButton.value, true);
		}
	}

	select(value, select) {
		this.#selected[select ? 'add' : 'delete'](value);

		let htmlButton = this.#buttons.get(value);
		if (htmlButton) {
			if (select && !this.#multiple) {
				for (let child of this.children) {
					if (child.hasAttribute('selected')) {
						child.removeAttribute('selected');
						this.dispatchEvent(new CustomEvent('change', {detail:{value:child.value, state:false}}));
						child.dispatchEvent(new CustomEvent('change', {detail:{value:child.value, state:false}}));
					}
				}
			}
			select ? htmlButton.setAttribute('selected', '') : htmlButton.removeAttribute('selected', '');
			this.dispatchEvent(new CustomEvent('change', {detail:{value:htmlButton.value, state:select}}));
			htmlButton.dispatchEvent(new CustomEvent('change', {detail:{value:htmlButton.value, state:select}}));
		}
	}

	isSelected(value) {
		let htmlButton = this.#buttons.get(value);
		return htmlButton?.value ?? false;
	}

	set disabled(disabled) {
		this.#disabled = disabled ? true : false;
		this.classList[this.#disabled ? 'add' : 'remove']('disabled');
	}

	get disabled() {
		return this.#disabled;
	}

	#initObserver() {
		let config = {childList:true, subtree: true};
		const mutationCallback = (mutationsList, observer) => {
			for (const mutation of mutationsList) {
				let addedNodes = mutation.addedNodes;
				for (let addedNode of addedNodes) {
					if (addedNode.parentNode == this) {
						this.#initButton(addedNode);
					}
				}
			}
		};

		let observer = new MutationObserver(mutationCallback);
		observer.observe(this, config);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'data-label':
				this.#htmlLabel.innerHTML = newValue;
				this.#htmlLabel.classList.remove('i18n');
				show(this.#htmlLabel);
				break;
			case 'data-i18n':
				this.#htmlLabel.setAttribute('data-i18n', newValue);
				this.#htmlLabel.innerHTML = newValue;
				this.#htmlLabel.classList.add('i18n');
				show(this.#htmlLabel);
				break;
			case 'disabled':
				this.disabled = newValue;
				break;
			case 'multiple':
				this.#multiple = true;
				break;
		}
	}

	static get observedAttributes() {
		return ['data-label', 'data-i18n', 'disabled', 'multiple'];
	}
}
