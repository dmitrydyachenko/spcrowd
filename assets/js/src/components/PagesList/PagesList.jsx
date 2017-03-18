/* External libraries */
import $ from 'jquery';
import React from 'react';

/* CSS styles */
import Styles from './PagesList.scss';

class PagesList extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
		fontsize: React.PropTypes.string,
		guid: React.PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			data: this.props.data
		};
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ data: nextProps.data });
	}

	render() {
		const self = this;
		const pages = self.state.data;
		const mainContent = pages && pages.length > 0 ? pages.map((item, i) => 
			<div key={i} className={Styles.item} style={{ fontSize: self.props.fontsize }}>
				{`${i + 1}. ${item.Title}`}
			</div>
		) : null;

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					{self.props.guid}
				</p>
				<p className={Styles.header}>
					{'Site pages:'}
				</p>
				<div className={Styles.content}>
					{mainContent}
				</div>
			</div>
		);
	}
}

export default PagesList;
