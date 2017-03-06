/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import Button from '../Partials/Button/Button';
import { PROJECTLIST, VIEWPROJECT } from '../../utils/settings';

/* CSS styles */
import Styles from './SearchArchiveProjectsResults.scss';

class SearchArchiveProjectsResults extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string,
		filterText: React.PropTypes.string
	};

	static defaultProps = {	
		listName: PROJECTLIST		
	};

	constructor() {
		super();
		this.state = {
			allData: [],
			data: [],
			itemCount: 0,
			viewItemsLimit: 5,
			initialItemsCount: 5
		};
		this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
	}

	componentDidMount() {
		this.getItems(this.props.filterText);
	}

	componentWillReceiveProps(nextProps) {        
		if (nextProps.filterText !== this.props.filterText) {
			this.getItems(nextProps.filterText);
		}
	}

	getItems(filterText) {
		const self = this;
		const settings = {
			select: 'ID, Title',
			filter: "ProjectStatus eq 'Archived'"
		};

		if (filterText) {
			settings.filter += ` and (substringof('${filterText}',  Title) or substringof('${filterText}',  Strapline))`;
		}

		(new SPOC.SP.Site()).ListItems(self.props.listName).query(settings).then(results =>
			self.setState(
				{ allData: results, itemCount: results ? results.length : 0 },
				() => {
					if (self.state.itemCount > self.state.initialItemsCount) {
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

	render() {
		const data = this.state.data;

		const mainContent = data && data.length > 0 ? data.map((item, i) => 
			<Button key={i} 
					className={`${Styles.button} ms-Grid-col ms-u-md3 ms-u-sm12`}
					value={item.Title} 
					href={`${_spPageContextInfo.webServerRelativeUrl}${VIEWPROJECT}?pid=${item.ID}`} />
		) 
		: <h1 className={Styles.empty}>No archived projects...</h1>;

		const showMore = this.state.itemCount > this.state.viewItemsLimit && data.length > 0 ?
		(	
			<Button value="Show more" 
					className={`${Styles.showmore_button} ms-Grid-col ms-u-sm12`}
					onClick={this.handleShowMoreClick} />
		) : null;

		return (
			<div className={`${Styles.archive_results} ms-Grid`}>
				<div className={`${Styles.header} ms-Grid-row`}>
					Archived Projects - Search Results
				</div>
				<div className="container">
					<div className={`${Styles.projects} ms-Grid-row`}>
						{mainContent}
					</div>
					<div className={`${Styles.showmore} ms-Grid-row`}>
						{showMore}
					</div>
				</div>
			</div>
		);
	}
}

export default SearchArchiveProjectsResults;