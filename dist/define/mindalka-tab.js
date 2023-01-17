import {MindalkaTab, styleInject} from '../mindalka-ui.js';
import {InjectUiStyle} from './.inject-ui-style.js';
if (window.customElements) {
	styleInject(`mindalka-tab{display:block;height:100%;overflow:auto}mindalka-tab:first-letter{text-transform:uppercase}.mindalka-tab-label{background-color:var(--main-bg-color-bright);border:1px solid #000;border-top:0;color:var(--main-text-color-dark2);cursor:pointer;display:inline-block;flex:0 0;padding:10px;pointer-events:all;position:relative;text-align:center;user-select:none;white-space:nowrap}.mindalka-tab-label.activated{background-color:var(--main-bg-color-dark);border-bottom:1px solid var(--main-bg-color-dark);border-left:1px solid #fff;z-index:2}`);
	customElements.define('mindalka-tab', MindalkaTab);
}