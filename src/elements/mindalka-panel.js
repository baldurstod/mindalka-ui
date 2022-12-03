let CustomPanelId = 0;
let dragged = null;
export class MindalkaPanel extends HTMLElement {
	static #nextId = 0;
	constructor() {
		super();
		this._parent = null;
		this._panels = new Set();
		this._size = 1;
		this._direction = undefined;
		this._isContainer = undefined;
		this._isMovable = undefined;
		this._isCollapsible = false;
		this._isCollapsed = false;

		//this.addEventListener('dragstart', event => this._handleDragStart(event));
		//this.addEventListener('dragover', event => this._handleDragOver(event));
		//this.addEventListener('drop', event => this._handleDrop(event));
		//this.addEventListener('mouseenter', event => this._handleMouseEnter(event));
		//this.addEventListener('mousemove', event => this._handleMouseMove(event));
		//this.addEventListener('mouseleave', event => this._handleMouseLeave(event));
		this.CustomPanelId = CustomPanelId++;
		if (!MindalkaPanel._spliter) {
			MindalkaPanel._spliter = document.createElement('div');
			MindalkaPanel._spliter.className = 'mindalka-panel-splitter';
		}

		this.htmlTitle = document.createElement('div');
		this.htmlTitle.className = 'title';
		this.htmlTitle.addEventListener('click', () => this._toggleCollapse());
		this.htmlContent = document.createElement('div');
		this.htmlContent.className = 'content';
	}

	connectedCallback() {
		if (!this.connectedCallbackOnce) {
			this.append(...this.childNodes);
			this.connectedCallbackOnce = true;
		}

		super.append(this.htmlTitle);
		super.append(this.htmlContent);

		//let parentElement = this.parentElement;

		/*if (this._parent && (this._parent != parentElement)) {
			this._parent._removePanel(this);
		}

		if (parentElement && parentElement.tagName == 'MINDALKA-PANEL') {
			parentElement._addPanel(this);
			this._parent = parentElement;
		}*/

		/*if (!this._firstTime) {
			this._firstTime = true;
			//this.style.backgroundColor = `rgb(${255*Math.random()},${255*Math.random()},${255*Math.random()})`;
			//this.append(this.CustomPanelId);
			this.title = this.CustomPanelId;
			this.direction = this._direction;
			//this.size = this._size;
			//this.draggable = true;
		}*/
	}

	append() {
		this.htmlContent.append(...arguments);
	}
	prepend() {
		this.htmlContent.prepend(...arguments);
	}
	appendChild(child) {
		this.htmlContent.appendChild(child);
	}


	get innerHTML() {
		return this.htmlContent.innerHTML;
	}
	set innerHTML(innerHTML) {
		this.htmlContent.innerHTML = innerHTML;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue == newValue) {
			return;
		}
		if (name == 'panel-direction') {
			this.direction = newValue;
		} else  if (name == 'panel-size') {
			this.size = newValue;
		} else  if (name == 'is-container') {
			this.isContainer = newValue;
		} else  if (name == 'is-movable') {
			this.isMovable = newValue;
		} else  if (name == 'collapsible') {
			this.collapsible = newValue;
		} else  if (name == 'collapsed') {
			this.collapsed = newValue;
		} else  if (name == 'title') {
			this.title = newValue;
		} else  if (name == 'title-i18n') {
			this.titleI18n = newValue;
		}
	}
	static get observedAttributes() {
		return ['panel-direction', 'panel-size', 'is-container', 'is-movable', 'title', 'title-i18n', 'collapsible', 'collapsed'];
	}

	_handleDragStart(event) {
		if (this._isMovable == false) {
			event.preventDefault();
			return;
		}
		event.stopPropagation();
		event.dataTransfer.setData('text/plain', null);
		dragged = event.target;
	}

	_handleDragOver(event) {
		if (this._isContainer != false) {
			event.preventDefault();
		}
		event.stopPropagation();
	}

	_handleDrop(event) {
		if (this._isContainer != false) {
			event.stopPropagation();
			event.preventDefault();
			if (dragged) {
				if (this != dragged) {
					this._addChild(dragged, event.offsetX, event.offsetY);
					//OptionsManager.setItem('app.layout.disposition', MindalkaPanel.saveDisposition());
				}
			}
		}
		dragged = null;
	}

	_handleMouseEnter(event) {
		//console.error(this, event);
		//clearInterval(MindalkaPanel._interval);
		//MindalkaPanel._interval = setInterval(event => this.style.opacity = (Math.floor(new Date().getTime() / 500) % 2) / 2 + 0.5, 100);
		//event.stopPropagation();
	}

	_handleMouseMove(event) {
		const delta = 5;
		//console.error(event.offsetX, event.offsetY);
		//this.style.opacity = (Math.floor(new Date().getTime() / 1000) % 2);
		//MindalkaPanel.highlitPanel = this;
		event.stopPropagation();
		if (event.offsetX < delta || event.offsetY < delta) {
			MindalkaPanel.highlitPanel = this;
			this.parentNode.insertBefore(MindalkaPanel._spliter, this);
		} else if ((this.offsetWidth - event.offsetX) < delta || (this.offsetHeight - event.offsetY) < delta) {
			MindalkaPanel.highlitPanel = this;
			this.parentNode.insertBefore(MindalkaPanel._spliter, this.nextSibling);
		} else {
			MindalkaPanel.highlitPanel = null;
		}

	}

	_handleMouseLeave(event) {
		//console.error(this, event);
		//clearInterval(MindalkaPanel._interval);
	}

	static set highlitPanel(panel) {
		if (MindalkaPanel._highlitPanel) {
			MindalkaPanel._highlitPanel.style.filter = null;
		}
		MindalkaPanel._highlitPanel = panel;
		if (MindalkaPanel._highlitPanel) {
			MindalkaPanel._highlitPanel.style.filter = 'grayscale(80%)';///'contrast(200%)';
		}
	}

	_addChild(child, x, y) {
		let percent = 0.2;
		let percent2 = 0.8;
		let height = this.clientHeight;
		let width = this.clientWidth;

		if (this._direction == undefined) {
			if (x <= width * percent) {
				this.prepend(dragged);
				this.direction = 'row';
			}
			if (x >= width * percent2) {
				this.append(dragged);
				this.direction = 'row';
			}
			if (y <= height * percent) {
				this.prepend(dragged);
				this.direction = 'column';
			}
			if (y >= height * percent2) {
				this.append(dragged);
				this.direction = 'column';
			}
		} else if (this._direction == 'row') {
			if (x <= width * percent) {
				this.prepend(dragged);
			}
			if (x >= width * percent2) {
				this.append(dragged);
			}
			if (y <= height * percent) {
				this._split(dragged, true, 'column');
			}
			if (y >= height * percent2) {
				this._split(dragged, false, 'column');
			}
		} else if (this._direction == 'column') {
			if (x <= width * percent) {
				this._split(dragged, true, 'row');
			}
			if (x >= width * percent2) {
				this._split(dragged, false, 'row');
			}
			if (y <= height * percent) {
				this.prepend(dragged);
			}
			if (y >= height * percent2) {
				this.append(dragged);
			}
		}
	}

	_split(newNode, before, direction) {
		let panel = MindalkaPanel._createDummy();//document.createElement('mindalka-panel');
		/*panel.id = MindalkaPanel.nextId;
		panel._isDummy = true;
		panel.classList.add('dummy');*/
		panel.size = this.size;
		this.style.flex = this.style.flex;
		this.after(panel);
		if (before) {
			panel.append(newNode);
			panel.append(this);
		} else {
			panel.append(this);
			panel.append(newNode);
		}
		panel.direction = direction;
	}

	static _createDummy() {
		let dummy = document.createElement('mindalka-panel');
		dummy.id = MindalkaPanel.#nextId;
		dummy._isDummy = true;
		dummy.classList.add('dummy');
		return dummy;
	}

	_addPanel(panel) {
		this._panels.add(panel);
	}

	_removePanel(panel) {
		this._panels.delete(panel);
		if (this._isDummy) {
			if (this._panels.size == 0) {
				this.remove();
			} else if (this._panels.size == 1) {
				this.after(this._panels.values().next().value);
				this.remove();
			}
		}
	}

	set active(active) {
		if (this._active != active) {
			this.dispatchEvent(new CustomEvent('activated'));
		}
		this._active = active;
		this.style.display = active ? '' : 'none';
		if (active) {
			this._header.classList.add('activated');
		} else {
			this._header.classList.remove('activated');
		}
	}

	_click() {
		this.active = true;
		if (this._group) {
			this._group.active = this;
		}
	}

	set direction(direction) {
		this._direction = direction;
		this.classList.remove('mindalka-panel-row');
		this.classList.remove('mindalka-panel-column');
		if (direction == 'row') {
			this.classList.add('mindalka-panel-row');
		} else if (direction == 'column') {
			this.classList.add('mindalka-panel-column');
		}
	}
	get direction() {
		return this._direction;
	}

	set size(size) {
		/*if (size === undefined) {
			return;
		}*/
		this._size = size;
		//this.style.flexBasis = size;
		this.style.flex = size;
	}
	get size() {
		return this._size;
	}

	set isContainer(isContainer) {
		this._isContainer = (isContainer == true) ? true : false;
	}

	set isMovable(isMovable) {
		this._isMovable = (isMovable == true) ? true : false;
	}

	set collapsible(collapsible) {
		this._isCollapsible = (collapsible == true) ? true : false;
		this.setAttribute('collapsible', this._isCollapsible ? 1 : 0);
		if (this._isCollapsible) {

		}
	}

	set collapsed(collapsed) {
		this._isCollapsed = (collapsed == true) ? this._isCollapsible : false;
		this.setAttribute('collapsed', this._isCollapsed ? 1 : 0);
		if (this._isCollapsed) {
			this.htmlContent.style.display = 'none';
		} else {
			this.htmlContent.style.display = '';
		}
	}

	set title(title) {
		if (title) {
			this.htmlTitle = this.htmlTitle ?? document.createElement('div');
			this.htmlTitle.innerHTML = title;
			super.prepend(this.htmlTitle);
		} else {
			this.htmlTitle.remove();
		}
	}

	set titleI18n(titleI18n) {
		this.htmlTitle.classList.add('i18n');
		this.htmlTitle.setAttribute('data-i18n', titleI18n);
		this.htmlTitle.remove();
		this.title = titleI18n;
	}

	_toggleCollapse() {
		this.collapsed = ! this._isCollapsed;
	}


	static get nextId() {
		return `mindalka-panel-dummy-${++MindalkaPanel.#nextId}`;
	}

	static saveDisposition() {
		let list = document.getElementsByTagName('mindalka-panel');
		let json = {panels:{},dummies:[]};
		for (let panel of list) {
			if (panel.id && panel.parentElement && panel.parentElement.id && panel.parentElement.tagName == 'MINDALKA-PANEL') {
				json.panels[panel.id] = {parent:panel.parentElement.id, size:panel.size, direction:panel.direction};
				if (panel._isDummy) {
					json.dummies.push(panel.id);
				}
			}
		}
		return json;
	}

	static restoreDisposition(json) {
		return;
		if (!json || !json.dummies || !json.panels) {return;}

		let dummiesList = new Map();
		for (let oldDummy of json.dummies) {
			let newDummy = MindalkaPanel._createDummy();
			document.body.append(newDummy);
			dummiesList.set(oldDummy, newDummy.id);
		}

		let list = document.getElementsByTagName('mindalka-panel');
		for (let panel of list) {
			if (panel.id) {
				let p = json.panels[panel.id];
				if (p) {
					if (p.size != 1 || panel._isDummy) {
						panel.size = p.size;
					}
					panel.direction = p.direction;
					let newParentId = dummiesList.get(p.parent) || p.parent;
					if (p && newParentId) {
						let parent = document.getElementById(newParentId);
						/*if (!parent && p.dummy) {
							parent = document.createElement('mindalka-panel');
						}*/
						if (parent) {
							parent.append(panel);
						} else {
							console.error('no parent', panel, newParentId);
						}
					}
				}
			}
		}
	}
}
