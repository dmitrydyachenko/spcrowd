/* External libraries */
import $ from 'jquery';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SPOC from 'SPOCExt';

/* Components */
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { GetRandomInt } from '../../utils/utils';
import { STYLELIBRARY } from '../../utils/settings';
import ContentTable from '../../components/ContentTable/ContentTable';
import CloudCarousel from '../../components/_RD/CloudCarousel/CloudCarousel';
import GifGenerator from '../../components/_RD/GifGenerator/GifGenerator';
import Emotions from '../../components/_RD/Emotions/Emotions';
import FacebookPosts from '../../components/_RD/FacebookPosts/FacebookPosts';
import PPTGeneratorContainer from '../../components/_RD/PPTGenerator/PPTGeneratorContainer';

/* CSS styles */
import Styles from './Home.scss';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			headerContent: null,
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
		const { 
			contentTable,
			setSource,
			setListName,
			setPrefixName,
			setGroupName,
			setContentTypesPrefix,
			setListsPrefix
		} = this.props;

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
						<div className={`${Styles.pptgenerator_container} ms-Grid-row`}>
							<div className="container">
								<div className="ms-Grid-col ms-u-sm12">
									<PPTGeneratorContainer />
								</div>
							</div>
						</div>
					) : null
				}
				{
					0 === 1 ? (
						<div className={`${Styles.fbposts_container} ms-Grid-row`}>
							<div className="container">
								<div className="ms-Grid-col ms-u-sm12">
									<FacebookPosts />
								</div>
							</div>
						</div>
					) : null
				}
				{
					0 === 1 ? (
						<div className={`${Styles.emotions_container} ms-Grid-row`}>
							<div className="container">
								<div className="ms-Grid-col ms-u-sm12">
									<Emotions />
								</div>
							</div>
						</div>
					) : null
				}
				{
					0 === 1 ? (
						<div className={`${Styles.gif_generator_container} ms-Grid-row`}>
							<div className="container">
								<div className="ms-Grid-col ms-u-sm12">
									<GifGenerator />
								</div>
							</div>
						</div>
					) : null
				}
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
									<ContentTable contentTable={contentTable}
													setSource={setSource} 
													setListName={setListName}
													setPrefixName={setPrefixName}
													setGroupName={setGroupName}
													setContentTypesPrefix={setContentTypesPrefix}
													setListsPrefix={setListsPrefix} />
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

Home.propTypes = {
	contentTable: PropTypes.objectOf(PropTypes.any),
	setSource: PropTypes.func,
	setListName: PropTypes.func,
	setPrefixName: PropTypes.func,
	setGroupName: PropTypes.func,
	setContentTypesPrefix: PropTypes.func,
	setListsPrefix: PropTypes.func
};