/* eslint import/no-unresolved: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

/* Global Styles */
import 'css/screen.scss';

/* Global Components */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import AppComponentsList from './AppConfig';

/* Application Entry Point */
$(document).ready(() => {
	$('.app-component-render').each((index, element) => {
		const AppComponentId = $(element).attr('id').toLowerCase();
		const AppComponent = AppComponentsList[AppComponentId];

		if (AppComponent) {
			ReactDOM.render(
				<AppComponent />,
				document.getElementById(AppComponentId)
			);
		}
	});
});
