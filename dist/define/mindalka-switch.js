import {MindalkaSwitch, styleInject} from '../dist/mindalka-ui.js';
import {InjectUiStyle} from '../dist/define/.inject-ui-style.js';
if (window.customElements) {
	styleInject(`:root{--mindalka-switch-width:4rem;--mindalka-switch-height:2rem;--mindalka-switch-on-background-color:#1072eb;--mindalka-switch-on-background-color-hover:#1040c1;--mindalka-switch-slider-width:1.4rem;--mindalka-switch-slider-height:1.4rem;--mindalka-switch-slider-margin:0.3rem;--mindalka-switch-slider-border-width:0rem}mindalka-switch{cursor:pointer;display:inline-flex;justify-content:space-between;overflow:hidden;user-select:none}.mindalka-switch-label{font-weight:700;margin:auto 0}.mindalka-switch-outer{align-items:center;border-radius:calc(var(--mindalka-switch-height)*.5);display:flex;flex:0 0 var(--mindalka-switch-width);height:var(--mindalka-switch-height);margin-left:.25rem;transition:background-color .25s linear}mindalka-switch>span{background-color:var(--mindalka-ui-input-background-primary)}mindalka-switch:hover>span{background-color:var(--mindalka-ui-input-background-secondary)}mindalka-switch.on>span{background-color:var(--mindalka-ui-accent-primary)}mindalka-switch.on:hover>span{background-color:var(--mindalka-ui-accent-secondary)}.mindalka-switch-inner{background-color:var(--mindalka-ui-input-background-tertiary);border:var(--mindalka-switch-slider-border-width) solid;border-color:var(--mindalka-ui-input-border-primary);border-radius:calc(var(--mindalka-switch-slider-height)*.5);box-sizing:border-box;display:inline-block;height:var(--mindalka-switch-slider-height);left:var(--mindalka-switch-slider-margin);position:relative;transition:all .25s;width:var(--mindalka-switch-slider-width)}mindalka-switch.on .mindalka-switch-inner{left:calc(100% - var(--mindalka-switch-slider-width) - var(--mindalka-switch-slider-margin))}`);
	customElements.define('mindalka-switch', MindalkaSwitch);
}