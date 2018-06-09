/* eslint import/no-unresolved: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

/* Global Styles */
import 'css/screen.scss';

/* Global Components */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import { store, mapStateToProps, mapDispatchToProps } from './redux/store';
import AppComponentsList from './AppConfig';

function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

/* Application Entry Point */
ready(() => {
	Array.prototype.forEach.call(document.querySelectorAll('.app-component-render'), 
		(component) => {
			const AppComponentId = component.getAttribute('id').toLowerCase();
			const AppComponent = AppComponentsList[AppComponentId];
			
			if (AppComponent) {
				const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

				ReactDOM.render(
					(
						<Provider store={store}>
							<App />
						</Provider>
					),
					document.getElementById(AppComponentId)
				);
			}
		}
	);
});