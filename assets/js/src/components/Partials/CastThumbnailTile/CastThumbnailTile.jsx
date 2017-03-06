/* External libraries */
import React from 'react';

/* Components */
import Tile from './Tile';

/* CSS styles */
import Styles from './CastThumbnailTile.scss';

class CastThumbnailTile extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string,
		data: React.PropTypes.arrayOf(React.PropTypes.object),
		showOverlayPanel: React.PropTypes.bool,
		noGridColumn: React.PropTypes.bool,
		expandedField: React.PropTypes.string,
		onFetchData: React.PropTypes.func,
		parentComponentTitle: React.PropTypes.string,
		userCanAdd: React.PropTypes.bool
	};

	constructor() {
		super();
		this.state = {
			data: []
		};
		this.handleFetchData = this.handleFetchData.bind(this);
	}

	componentDidMount() {
		this.getItems(this.props.data);
	}

	componentWillReceiveProps(nextProps) {        
		this.getItems(nextProps.data);
	}

	getItems(data) {
		this.setState({ data });
	}

	handleFetchData() {
		if (this.props.onFetchData) {
			this.props.onFetchData();
		}
	}

	render() {
		const self = this;
		const data = self.state.data;

		const tiles = data && data.length > 0 ? data.map((item, i) => 
			<Tile key={i}
					item={item}
					listName={self.props.listName}
					parentComponentTitle={self.props.parentComponentTitle} 
					noGridColumn={self.props.noGridColumn} 
					expandedField={self.props.expandedField}
					showOverlayPanel={self.props.showOverlayPanel}
					onFetchData={self.handleFetchData}
					userCanAdd={self.props.userCanAdd} />) 
			: null;

		return (
			<div className={Styles.container}>
				{tiles}
			</div>
		);
	}
}

export default CastThumbnailTile;