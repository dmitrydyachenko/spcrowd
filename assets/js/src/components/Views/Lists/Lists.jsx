/* External libraries */
import React from 'react';

/* CSS styles */
import Styles from './Lists.scss';

class Lists extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object),
		columns: React.PropTypes.arrayOf(React.PropTypes.string),
		title: React.PropTypes.string,
		xmlFilePath: React.PropTypes.string
	};

	static defaultProps = {	
		title: 'Lists table'
	};

	constructor(props) {
		super(props);

		this.state = {
			data: props.data,
			xmlFilePath: props.xmlFilePath
		};
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			data: nextProps.data,
			xmlFilePath: nextProps.xmlFilePath
		});
	}

	render() {
		const self = this;
		const data = self.state.data;
		const show = data && data.length > 0;

		let mainContent = null;

		if (show) {
			const content = data.map((item, i) => 
				<div key={i} className={`${Styles.item_row} ms-Grid-row`}>
					<div className={`${Styles.item_column} column ms-Grid-col ms-u-sm3`}>	
						{item.Name}
					</div>
					<div className={`${Styles.item_column} column ms-Grid-col ms-u-sm3`}>	
						{item.Type}
					</div>
					<div className={`${Styles.item_column} column ms-Grid-col ms-u-sm3`}>	
						{item.Constraints}
					</div>
					<div className={`${Styles.item_column} column ms-Grid-col ms-u-sm3`}>	
						{item.Comments}
					</div>
				</div>
			);

			mainContent = (
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.header_row} ms-Grid-row`}>
							<div className={`${Styles.header_column} column ms-Grid-col ms-u-sm12`}>	
								<div className={Styles.title_container}>
									{self.props.title}
								</div>
								{
									self.state.xmlFilePath ? 
									(
										<div className={Styles.buttons_container}>
											<a className="button" href={self.state.xmlFilePath}>
												Download XML
											</a>
										</div>
									) : null
								}
							</div>
						</div>
						<div className={`${Styles.header_row} ms-Grid-row`}>
							<div className={`${Styles.header_column} column ms-Grid-col ms-u-sm3`}>	
								Name
							</div>
							<div className={`${Styles.header_column} column ms-Grid-col ms-u-sm3`}>	
								Type
							</div>
							<div className={`${Styles.header_column} column ms-Grid-col ms-u-sm3`}>	
								Constraints
							</div>
							<div className={`${Styles.header_column} column ms-Grid-col ms-u-sm3`}>	
								Comments
							</div>
						</div>
						{content}
					</div>
				</div>
			);
		}

		return (
			<div className={Styles.container}>
				{mainContent}
			</div>
		);
	}
}

export default Lists;