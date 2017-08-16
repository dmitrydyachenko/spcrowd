/* eslint no-unused-vars: 0 */
/* eslint no-eval: 0 */
/* eslint import/no-webpack-loader-syntax: 0 */
/* eslint import/no-unresolved: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pnp from 'sp-pnp-js';

const src = require('raw!pptxgenjs');
const temp_$ = require('jquery');
const temp_JSZip = require('jszip'); 

module.exports = undefined;

const PptxGenJS = eval([
	'var $ = temp_$;',
	'var JSZip = temp_JSZip;',
	src,
	'PptxGenJS;'
].join('\n'));

module.exports = PptxGenJS;

import PPTGenerator from './PPTGenerator';

export default class PPTGeneratorContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {

		};
	}

	componentDidMount() {
		this.init();
	}

	init() {
		const pptx = new PptxGenJS();
		const slide = pptx.addNewSlide();

		slide.addText('Tables Example', { x: 0.5, y: 0.25, font_size: 18, font_face: 'Arial', color: '0088CC' });

		// TABLE 1: Simple array (if there is only one row of data, you can just use a simple array)
		const arrRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		let tabOpts = { x: 0.5, y: 1.0, w: 9.0 };

		let celOpts = { color: '363636', fill: 'F7F7F7', font_size: 14 };

		slide.addTable(arrRows, tabOpts, celOpts);

		// TABLE 2: Multi-row Array (data structure: rows are arrays of cells)
		let rows = [
			['A1', 'B1', 'C1'],
			['A2', 'B2', 'C3']
		];

		tabOpts = { x: 0.5, y: 2.0, w: 9.0 };

		celOpts = {
			fill: 'dfefff', 
			font_size: 18, 
			color: '6f9fc9', 
			rowH: 1.0,
			valign: 'm', 
			align: 'c', 
			border: { 
				pt: '1', 
				color: 'FFFFFF' 
			}
		};

		slide.addTable(rows, tabOpts, celOpts);

		// TABLE 3: Formatting can be done on a cell-by-cell basis
		// TIP: Use this to selectively override table style options
		rows = [
			[
				{ text: 'Top Lft', opts: { valign: 't', align: 'l', font_face: 'Arial' } },
				{ text: 'Top Ctr', opts: { valign: 't', align: 'c', font_face: 'Verdana' } },
				{ text: 'Top Rgt', opts: { valign: 't', align: 'r', font_face: 'Courier' } }
			]
		];

		tabOpts = { x: 0.5, y: 4.5, w: 9.0 };
		celOpts = {
			fill: 'dfefff', 
			font_size: 18, 
			color: '6f9fc9', 
			rowH: 0.6,
			valign: 'm', 
			align: 'c', 
			border: { 
				pt: '1', 
				color: 'FFFFFF' 
			}
		};

		slide.addTable(rows, tabOpts, celOpts);

		pptx.save('Demo-Tables');
	}

	render() {
		return (
			<PPTGenerator {...this.state} />
		);
	}
}

PPTGeneratorContainer.propTypes = {

};