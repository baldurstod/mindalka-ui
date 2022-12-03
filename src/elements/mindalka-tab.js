import {createElement, hide, show, display} from '../mindalka-html.js';

export class MindalkaTab extends HTMLElement {
	#disabled = false;
	#active = false;
	#header;
	#group;
	constructor() {
		super();
		this.#header = createElement('div', {
			class: 'mindalka-tab-label',
			i18n: this.getAttribute('data-i18n'),
			events: {
				click: event => this.#click(event)
			}
		});
	}

	get htmlHeader() {
		return this.#header;
	}

	connectedCallback() {
		let parentElement = this.parentElement;
		if (parentElement && parentElement.tagName == 'MINDALKA-TAB-GROUP') {
			parentElement.addTab(this);
			this.#group = parentElement;
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'data-i18n':
				this.#header.setAttribute('data-i18n', newValue);
				break;
			case 'disabled':
				this.disabled = newValue;
				break;
		}
	}

	set disabled(disabled) {
		this.#disabled = disabled ? true : false;
		this.#header.classList[this.#disabled?'add':'remove']('disabled');
	}

	get disabled() {
		return this.#disabled;
	}

	activate() {
		this.active = true;
	}

	set active(active) {
		if (this.#active != active) {
			this.#active = active;
			if (active) {
				this.dispatchEvent(new CustomEvent('activated'));
			} else {
				this.dispatchEvent(new CustomEvent('deactivated'));
			}
		}
		display(this, active);
		if (active) {
			this.#header.classList.add('activated');
		} else {
			this.#header.classList.remove('activated');
		}

		if (active && this.#group) {
			this.#group.active = this;
		}
	}

	get active() {
		return this.#active;
	}

	#click() {
		if (!this.#disabled) {
			this.activate();
		}
	}

	static get observedAttributes() {
		return ['data-i18n', 'disabled'];
	}
}
