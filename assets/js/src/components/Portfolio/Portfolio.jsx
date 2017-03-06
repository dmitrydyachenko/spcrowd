import React from 'react';
import Button from '../Partials/Button/Button';
import Styles from './Portfolio.scss';

class Portfolio extends React.Component {
	static propTypes = {
		data: React.PropTypes.arrayOf(React.PropTypes.object)
	};

	constructor() {
		super();
		this.state = {
			data: [],
			portfolios: []
		};
	}

	componentDidMount() {
		this.getItems(this.props.data);
	}

	getItems(data) {
		const self = this;

		self.setState({ data }, () => {
			self.setCastPortfolios(self.state.data);
		});
	}

	setCastPortfolios(data) {
		if (data && data.length > 0) {
			this.formatCastPortfolios(data[0].PortfolioItemOne);
			this.formatCastPortfolios(data[0].PortfolioItemTwo);
			this.formatCastPortfolios(data[0].PortfolioItemThree);
			this.formatCastPortfolios(data[0].PortfolioItemFour);
			this.formatCastPortfolios(data[0].PortfolioItemFive);
		}
	}

	formatCastPortfolios(field) {
		if (field && field.Url && field.Description) {
			const portfolios = this.state.portfolios;

			let fieldDescription = decodeURIComponent(field.Description);

			fieldDescription = fieldDescription.length > 15 ? 
									`${fieldDescription.substr(0, 10).trim()}...` : 
										fieldDescription;

			portfolios.push({ Title: fieldDescription, Link: field.Url });

			this.setState({ portfolios });
		}
	}

	render() {
		const self = this;
		const data = self.state.portfolios;
		const show = data && data.length > 0;

		let mainContent = null;

		if (show) {
			mainContent = data.map((item, i) => 
				<Button key={i} 
						className={`ms-Grid-col ms-u-md6 ms-u-sm12 ${Styles.button}`}
						value={item.Title} 
						href={item.Link} />
			); 
		}

		return (
			<div className={`${Styles.container}`}>
				<div className="ms-Grid">
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>Portfolio</h1>
					</div>
					<div className={`${Styles.items} ms-Grid-row`} style={data.length === 1 ? { textAlign: 'center' } : null}>
						{mainContent}
					</div>
				</div>
			</div>
		);
	}
}

export default Portfolio;
