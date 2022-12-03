import fs from 'fs';
import postcss from 'postcss';
import cssnano from 'cssnano';
import {elements} from './src/elements/.elements.js';

async function writeElement(elementName, elementClass) {
	let cssPath = `./src/css/${elementName}.css`;
	let input = fs.readFileSync(cssPath);
	let css = await postcss([cssnano()]).process(input);

	let fileContent = `import {${elementClass}, styleInject} from '../dist/mindalka-ui.js';
import {InjectUiStyle} from '../define/.inject-ui-style.js';
if (window.customElements) {
	styleInject(\`${css}\`);
	customElements.define('${elementName}', ${elementClass});
}`;

	fs.writeFile(`./define/${elementName}.js`, Buffer.from(fileContent), async (err) => {if (err) throw err});
}

async function writeGlobal() {
	let cssPath = `./src/css/mindalka-ui.css`;
	let input = fs.readFileSync(cssPath);
	let css = await postcss([cssnano()]).process(input);

	let fileContent = `import {styleInject} from '../dist/mindalka-ui.js';
export const InjectUiStyle = (function () {
	styleInject(\`${css}\`);
}());`;

	fs.writeFile(`./define/.inject-ui-style.js`, Buffer.from(fileContent), async (err) => {if (err) throw err});
}

fs.mkdir('./define/', undefined, err => err && console.log(err));

for (let elementName in elements) {
	let elementClass = elements[elementName];
	writeElement(elementName, elementClass);
}
writeGlobal();

export default [
	{
		input: './src/index.js',
		output: {
			file: './dist/mindalka-ui.js',
			format: 'esm'
		},
		plugins: [
		],
	},
];
