import {MindalkaTabGroup, styleInject} from '../dist/mindalka-ui.js';
import {InjectUiStyle} from '../dist/define/.inject-ui-style.js';
if (window.customElements) {
	styleInject(`mindalka-tab-group{display:flex;flex-direction:column;height:100%;overflow:hidden;position:relative;width:100%}.mindalka-tab-group-header{background-color:var(--main-bg-color-bright);display:flex;flex:0 0}.mindalka-tab-group-content{background-color:var(--main-bg-color-dark);flex:1;overflow:auto}`);
	customElements.define('mindalka-tab-group', MindalkaTabGroup);
}