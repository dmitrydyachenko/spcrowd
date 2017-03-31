/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { GenerateGuid, GetRandomInt } from '../../utils/utils';
import { PAGESLIST, STYLELIBRARY } from '../../utils/settings';
import PagesList from '../../components/PagesList/PagesList';
import ExcelTable from '../../components/ExcelTable/ExcelTable';
import CloudCarousel from '../../components/CloudCarousel/CloudCarousel';
import GifGenerator from '../../components/GifGenerator/GifGenerator';

/* CSS styles */
import Styles from './Home.scss';

class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			data: [],
			headerContent: null,
			fontsize: '14px',
			loading: true,
			subItems: []
		};

		this.site = new SPOC.SP.Site();
	}

	componentDidMount() {
		this.init();
	}

	init() {
		const self = this;

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

		const pagesListSettings = {
			select: 'Title'
		};

		self.site.ListItems(PAGESLIST).query(pagesListSettings).then((data) => {
			self.setState({ data });
		},
		(error) => {
			console.log(error);
		});

		const cloudCarouselSettings = {
			select: 'FileLeafRef, FileRef, Modified',
			top: 20
		};

		self.site.ListItems(STYLELIBRARY).query(cloudCarouselSettings).then((subItems) => {
			for (let i = 0; i < subItems.length; i++) {
				const weight = GetRandomInt(100, 500);

				subItems[i].width = weight / 2;
				subItems[i].height = weight / 2;
				subItems[i].weight = weight;
			}

			self.setState({ subItems });
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
				{
					0 === 1 ? (
						<div>
							<div className={`${Styles.content_container} ms-Grid-row`}>
								<div className="container">
									<div className="ms-Grid-col ms-u-sm12">
										<PagesList data={this.state.data} 
													guid={GenerateGuid()} 
													fontsize={this.state.fontsize} />
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
												onChange={fontsize => this.setState({ fontsize: `${fontsize}px` })} />
									</div>
								</div>
							</div>
						</div>
					) : null
				}
				<div className={`${Styles.gif_generator_container} ms-Grid-row`}>
					<div className="container">
						<div className="ms-Grid-col ms-u-sm12">
							<GifGenerator />
						</div>
					</div>
				</div>
				{
					0 === 1 ? (
						<div className={`${Styles.cloud_carousel_container} ms-Grid-row`}>
							<div className="container">
								<div className="ms-Grid-col ms-u-sm12">
									{
										this.state.subItems && this.state.subItems.length > 0 ?
											<CloudCarousel items={[1, 2]} subItems={this.state.subItems} /> : null
									}
								</div>
							</div>
						</div>
					) : null
				}
				{
					0 === 0 ? (
						<div className={`${Styles.excel_table_view_container} ms-Grid-row`}>
							<div className="container">
								<div className="ms-Grid-col ms-u-sm12">
									<ExcelTable />
								</div>
							</div>
						</div>
					) : null
				}
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