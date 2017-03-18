/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { GenerateGuid } from '../../utils/utils';
import { PAGESLIST } from '../../utils/settings';
import PagesList from '../../components/PagesList/PagesList';

/* CSS styles */
import Styles from './Home.scss';

class Home extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string
	};

	static defaultProps = {	
		listName: PAGESLIST		
	};	

	constructor() {
		super();

		this.state = {
			data: [],
			headerContent: null,
			fontsize: 14,
			loading: true
		};

		this.site = new SPOC.SP.Site();
	}

	componentDidMount() {
		const self = this;
		
		setTimeout(() => {
			self.init();
		}, 3000);
	}

	init() {
		const self = this;
		const settings = {
			select: 'Title'
		};

		$.ajax({
			url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/Description`,
			type: 'GET',
			headers: { accept: 'application/json;odata=verbose' },
			success: (data) => {
				const description = data && data.d ? data.d.Description : null;

				if (description) {
					const headerContent = (
						<div>
							<div className={Styles.header_title}>
								{_spPageContextInfo.webTitle}
							</div>
							<div className={Styles.header_description}>
								{description}
							</div>
						</div>
					);

					self.setState({ headerContent, loading: false });
				}
			}
		});

		self.site.ListItems(self.props.listName).query(settings).then((data) => {
			self.setState({ data });
		},
		(error) => {
			console.log(error);
		});
	}

	render() {
		const mainContent = this.state.loading ? 
		(
			<Spinner type={SpinnerType.large} label="Seriously, still loading..." />
		) 
		:
		(
			<div className="ms-Grid">
				<div className={`${Styles.top_container} ms-Grid-row`}>
					<div className="container">
						<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
							{this.state.headerContent}
						</div>
					</div>
				</div>
				<div className={`${Styles.content_container} ms-Grid-row`}>
					<div className="container">
						<div className="ms-Grid-col ms-u-sm12">
							<PagesList data={this.state.data} 
										guid={GenerateGuid()} 
										fontsize={this.state.fontsize.toString()} />
						</div>
					</div>
				</div>
				<div className={`${Styles.bottom_container} ms-Grid-row`}>
					<div className="container">
						<div className="ms-Grid-col ms-u-sm12">
							<Slider label="Font size:" 
									min={8} max={64} step={2}
									defaultValue={14} 
									showValue
									onChange={fontsize => this.setState({ fontsize })} />
						</div>
					</div>
				</div>
			</div>
		);

		return (
			<div className={Styles.container}>
				{mainContent}
			</div>
		);
	}
}

export default Home;