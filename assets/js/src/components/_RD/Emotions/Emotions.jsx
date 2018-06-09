/* External libraries */
import $ from 'jquery';
import React from 'react';

/* Components */
import { ToDataUrl, MakeBlob } from '../../../utils/utils';
import { PUBLISHINGIMAGESLIBRARY } from '../../../utils/settings';

/* CSS styles */
import Styles from './Emotions.scss';

class Emotions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: []
		};
	}

	componentDidMount() {
		this.init();
	}

	init() {
		const self = this;

		ToDataUrl(`${_spPageContextInfo.webServerRelativeUrl}/${PUBLISHINGIMAGESLIBRARY}/user.jpg`, (base64Img) => {
			self.getEmotions(base64Img);
		});
	}

	getEmotions(base64Img) {
		$.ajax({
			url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
			beforeSend: (xhrObj) => {
				xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
				xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', '6ff4ad71def34dd782a2baba7dca8e6e');
			},
			type: 'POST',
			data: MakeBlob(base64Img),
			processData: false
		})
		.done((response) => {
			console.log('success');
		})
		.fail(() => {
			console.log('error');
		});
	}

	render() {
		const self = this;
		const show = true;

		let mainContent = null;

		if (show) {
			mainContent = (
				<div className={Styles.emotions_container} />
			);
		}

		return (
			<div className={Styles.container}>
				<p className="header">
					Emotions
				</p>
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.row} ms-Grid-row`}>
							<div className={`${Styles.column} ms-Grid-col ms-u-sm12`}>	
								{mainContent}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Emotions;