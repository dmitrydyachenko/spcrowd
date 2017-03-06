/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import SearchCasts from '../../components/SearchCasts/SearchCasts';
import CastThumbnail from '../../components/CastThumbnail/CastThumbnail';
import CurrentProjects from '../../components/Projects/CurrentProjects/CurrentProjects';
import { CASTLIST, ALLCASTPAGE } from '../../utils/settings';
import { RedirectToPage } from '../../utils/utils';

/* CSS styles */
import Styles from './Home.scss';

class Home extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string
	};

	static defaultProps = {	
		listName: CASTLIST		
	};	

	constructor() {
		super();
		this.state = {
			headerContent: null
		};
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		this.getHeaderContent();
	}

	getHeaderContent() {
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

					self.setState({ headerContent });
				}
			}
		});
	}

	handleSearch(filters, searchKeyWord) {
		const storageAvailable = SPOC.Utils.Storage.storageAvailable();

		if (storageAvailable) {
			SPOC.Utils.Storage.set(`FilterQueryKeyWord_${_spPageContextInfo.userId}`, `{"searchKeyWord":"${searchKeyWord || ''}"}`);
			SPOC.Utils.Storage.set(`FilterQueryFilters_${_spPageContextInfo.userId}`, filters || {});
			RedirectToPage(`${_spPageContextInfo.webServerRelativeUrl}${ALLCASTPAGE}`);	
		} else {
			console.log('Storage is not available');
		}
	}

	render() {
		return (
			<div className={Styles.container}>
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								{this.state.headerContent}
							</div>
						</div>
					</div>
					<div className={`${Styles.search_container} ms-Grid-row`}>
						<SearchCasts onSearch={this.handleSearch} />
					</div>
					<div className={`${Styles.topcurve} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm12" />
					</div>
					<div className={`${Styles.projects_container} ms-Grid-row`}>
						<CurrentProjects />
					</div>
					<div className={`${Styles.results_container} ms-Grid-row`}>
						<CastThumbnail initialItemsCount={5} title="Recent Casts" />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;