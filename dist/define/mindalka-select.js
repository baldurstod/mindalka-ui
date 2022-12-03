import {MindalkaSelect, styleInject} from '../dist/mindalka-ui.js';
import {InjectUiStyle} from '../dist/define/.inject-ui-style.js';
if (window.customElements) {
	styleInject(``);
	customElements.define('mindalka-select', MindalkaSelect);
}