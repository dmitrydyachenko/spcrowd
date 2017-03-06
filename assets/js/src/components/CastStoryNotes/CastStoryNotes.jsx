import React from 'react';
import Styles from './CastStoryNotes.scss';

class CastStoryNotes extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object)
	};

	constructor() {
		super();
		this.state = {
			data: [],
			notes: '',
			story: ''
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
			self.getCastNotes(self.state.data);
			self.getCastStory(self.state.data);
		});
	}

	getCastNotes(data) {
		if (data && data.length > 0) {
			const item = data[0];

			if (item && item.AgencyNotes) {
				this.setState({ notes: item.AgencyNotes });
			}
		}
	}

	getCastStory(data) {
		if (data && data.length > 0) {
			const item = data[0];

			if (item && item.BeautyStories) {
				this.setState({ story: item.BeautyStories });
			}
		}
	}

	createMarkup(htmlString) {
		return {
			__html: htmlString
		};
	}

	render() {
		const self = this;

		return (
			<div className={`${Styles.container}`}>
				<div className="ms-Grid">
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>Agency Notes</h1>
					</div>
					<div className={`${Styles.notes} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12">
							<div dangerouslySetInnerHTML={self.createMarkup(self.state.notes)} />
						</div>
					</div>
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>Beauty Story</h1>
					</div>
					<div className={`${Styles.story} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12">
							<div dangerouslySetInnerHTML={self.createMarkup(self.state.story)} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CastStoryNotes;
