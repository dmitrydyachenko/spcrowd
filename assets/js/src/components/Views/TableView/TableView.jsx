/* External libraries */
import React from 'react';

/* CSS styles */
import Styles from './TableView.scss';

class TableView extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object),
		columns: React.PropTypes.arrayOf(React.PropTypes.string),
		title: React.PropTypes.string,
		xmlFilePath: React.PropTypes.string
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
		const cx = 12 / self.props.columns.length;

		let mainContent = null;

		if (show) {
			const content = data.map((item, i) => 
				<div key={i} className={`${Styles.item_row} ms-Grid-row`}>
					{
						self.props.columns.map((column, j) => 
							<div key={j} className={`${Styles.item_column} column ms-Grid-col ms-u-sm${cx}`}>	
								{item[column]}
							</div>
						)
					}
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
							{
								self.props.columns.map((column, i) => 
									<div key={i} className={`${Styles.header_column} column ms-Grid-col ms-u-sm${cx}`}>	
										{column}
									</div>
								)
							}
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

export default TableView;