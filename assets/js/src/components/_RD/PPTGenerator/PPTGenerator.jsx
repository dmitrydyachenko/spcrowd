import React from 'react';
import PropTypes from 'prop-types';

import Styles from './PPTGenerator.scss';

const PPTGenerator = (props) => {
	const i = 0;

	return (
		<div className={`${Styles.container} ms-Grid container`}>
			<div className={`${Styles.header} ms-Grid-row`}>
				PPT Generator
			</div>
		</div>
	);
};

PPTGenerator.propTypes = {

};

export default PPTGenerator;