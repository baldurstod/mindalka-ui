import {MindalkaSelect, styleInject} from '../mindalka-ui.js';
import {InjectUiStyle} from './.inject-ui-style.js';
if (window.customElements) {
	styleInject(``);
	customElements.define('mindalka-select', MindalkaSelect);
}