import {MindalkaContextMenu, styleInject} from '../dist/mindalka-ui.js';
import {InjectUiStyle} from '../dist/define/.inject-ui-style.js';
if (window.customElements) {
	styleInject(`mindalka-context-menu{background-color:green;background-color:var(--theme-context-menu-bg-color);cursor:not-allowed;font-size:1.5em;overflow:auto;position:absolute;z-index:100000}.mindalka-context-menu-item{background-color:green;background-color:var(--theme-context-menu-item-bg-color);cursor:pointer}.mindalka-context-menu-item.disabled{pointer-events:none}.mindalka-context-menu-item.selected{background-color:blue;background-color:var(--theme-context-menu-item-selected-bg-color)}.mindalka-context-menu-item.separator{background-color:#000;height:5px}.mindalka-context-menu-item>.mindalka-context-menu-item-title:hover{background-color:var(--theme-context-menu-item-hover-bg-color)}.mindalka-context-menu-item.selected>.mindalka-context-menu-item-title:after{content:"✔";position:absolute;right:0}.mindalka-context-menu-item>.mindalka-context-menu-item-title:after{height:32px;transition:all .2s ease 0s;width:32px}.mindalka-context-menu-item.closed>.mindalka-context-menu-item-title,.mindalka-context-menu-item.opened>.mindalka-context-menu-item-title{padding-right:32px}.mindalka-context-menu-item.closed>.mindalka-context-menu-item-title:after{content:"➤";position:absolute;right:0}.mindalka-context-menu-item.opened>.mindalka-context-menu-item-title:after{content:"➤";position:absolute;right:0;transform:rotate(90deg)}.mindalka-context-menu-item .submenu{background-color:var(--theme-context-menu-submenu-bg-color);background-color:var(--theme-context-menu-submenu-fg-color);display:none;margin-left:2px;overflow:hidden;padding-left:10px;position:relative}.mindalka-context-menu-item.opened>.submenu{display:block}`);
	customElements.define('mindalka-context-menu', MindalkaContextMenu);
}