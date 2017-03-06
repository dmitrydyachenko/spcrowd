import React from 'react';
import Styles from './CastVideo.scss';

class CastVideo extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object)
	};

	constructor() {
		super();
		this.state = {
			data: [],
			video: ''
		};
	}

	componentDidMount() {
		this.getItems(this.props.data);
	}

	componentWillReceiveProps(nextProps) {        
		this.getItems(nextProps.data);
	}

	getItems(data) {
		const self = this;

		self.setState({ data }, () => {
			self.getCastVideo(self.state.data);
		});
	}

	getCastVideo(data) {
		if (data && data.length > 0) {
			const item = data[0];

			if (item && item.EmbedVideo && item.EmbedVideo.Url) {
				this.setState({ video: item.EmbedVideo.Url });
			}
		}
	}

	render() {
		const self = this;
		const videoContent = self.state.video ? <video src={self.state.video} controls /> : null;

		return (
			<div className={`${Styles.container}`}>
				<div className="ms-Grid">
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>Video</h1>
					</div>
					<div className={`${Styles.video} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12">
							{videoContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CastVideo;
