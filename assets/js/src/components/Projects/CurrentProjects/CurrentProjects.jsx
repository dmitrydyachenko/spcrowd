/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import SearchArchiveProjects from '../../SearchArchiveProjects/SearchArchiveProjects';
import SearchArchiveProjectsResults from '../../SearchArchiveProjects/SearchArchiveProjectsResults';
import Button from '../../Partials/Button/Button';
import { ALLPROJECTS, PROJECTLIST, VIEWPROJECT } from '../../../utils/settings';

/* CSS styles */
import Styles from './CurrentProjects.scss';

class CurrentProjects extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string,
		initialItemsCount: React.PropTypes.number,
		archivedProjects: React.PropTypes.bool
	};

	static defaultProps = {	
		listName: PROJECTLIST,
		initialItemsCount: 5		
	};	

	constructor() {
		super();
		this.state = {
			allData: [],
			data: [],
			itemCount: 0,
			viewItemsLimit: 5,
			filterText: ''
		};
		this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
		this.handleSearchClick = this.handleSearchClick.bind(this);
	}

	componentDidMount() {
		this.getItems();
	}

	getItems() {
		const self = this;
		const settings = {
			select: 'ID, Title',
			filter: "ProjectStatus eq 'Current'",
			orderBy: 'Created desc'
		};

		(new SPOC.SP.Site()).ListItems(self.props.listName).query(settings).then(results =>
			self.setState(
				{ allData: results, itemCount: results ? results.length : 0 },
				() => {
					if (self.state.itemCount > self.props.initialItemsCount) {
						self.setState({ data: self.state.allData.slice(0, self.state.viewItemsLimit) });
					} else {
						self.setState({ data: self.state.allData });
					}
				}
			));
	}

	handleShowMoreClick() {
		const viewItemsLimit = this.state.viewItemsLimit + 5;

		this.setState({
			data: this.state.allData.slice(0, viewItemsLimit),
			viewItemsLimit
		});
	}

	handleSearchClick(filterText) {
		this.setState({ filterText });
	}

	render() {
		const data = this.state.data;

		const mainContent = data.length > 0 ? data.map((item, i) => 
			<Button key={i} 
					className={`ms-Grid-col ms-u-md3 ms-u-sm12 ${Styles.button}`}
					value={(item.Title && item.Title.length > 15 ? `${item.Title.substr(0, 10).trim()}...` : item.Title)} 
					href={`${_spPageContextInfo.webServerRelativeUrl}${VIEWPROJECT}?pid=${item.ID}`}
					onClick={this.handleViewProject} />
		) 
		: 
		( 
			<span className={Styles.empty}>
				<h1>No current projects...</h1>
			</span>
		);

		const showMore = this.state.itemCount > this.state.viewItemsLimit && data.length > 0 ?
		(	
			<div className={`${Styles.showmore_container} ms-Grid-col ms-u-sm12`}>
				<Button value="Show more" 
						className={`${Styles.showmore_area}`}
						onClick={this.handleShowMoreClick} />
			</div>
		) : null;

		const searchArchiveProjects = this.props.archivedProjects ? 
		(
			<SearchArchiveProjects onSearchClick={this.handleSearchClick} />
		)
		:
		( 
			<SearchArchiveProjects href={`${_spPageContextInfo.webServerRelativeUrl}${ALLPROJECTS}`} />
		);

		const archivedProjectsResults = this.props.archivedProjects ? (
			<SearchArchiveProjectsResults filterText={this.state.filterText} />
		) : null;
	
		return (
			<div>
				<div className={`${Styles.container} ms-Grid`}>
					<div className={`${Styles.header} ms-Grid-row`}>
						Current Projects
					</div>
					<div className="container">
						<div className={`${Styles.projects} ms-Grid-row`}>
							{mainContent}
						</div>
						<div className={`${Styles.showmore} ms-Grid-row`}>
							{showMore}
						</div>
						<div className="ms-Grid-row">
							{searchArchiveProjects}
						</div>
					</div>
				</div>
				{archivedProjectsResults}
			</div>
		);
	}
}

export default CurrentProjects;
