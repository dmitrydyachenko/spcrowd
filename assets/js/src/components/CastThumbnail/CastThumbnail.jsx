/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CastThumbnailTile from '../Partials/CastThumbnailTile/CastThumbnailTile';
import Button from '../Partials/Button/Button';
import { GetPermissions, IfArrayContainsObject } from '../../utils/utils';
import { CASTLIST, PROJECTLIST } from '../../utils/settings';

/* CSS styles */
import Styles from './CastThumbnail.scss';

class CastThumbnail extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string,
		select: React.PropTypes.string,
		filter: React.PropTypes.string,
		title: React.PropTypes.string,
		expand: React.PropTypes.arrayOf(React.PropTypes.string),
		initialItemsCount: React.PropTypes.number,
		expandedField: React.PropTypes.string,
		onFetchData: React.PropTypes.func,
		forceRerender: React.PropTypes.bool
	};

	static defaultProps = {	
		listName: CASTLIST,
		select: 'Id, CastName, ProfilePhoto',
		initialItemsCount: 15,
		expand: []
	};	

	constructor(props) {
		super(props);
		this.state = {
			allData: [],
			data: [],
			itemCount: 0,
			viewItemsLimit: props.initialItemsCount,
			filter: props.filter,
			userCanAdd: false
		};
		this.site = new SPOC.SP.Site();
		this.projectId = SPOC.Utils.Url.getQueryString('pid');
		this.handleFetchData = this.handleFetchData.bind(this);
		this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
	}

	componentDidMount() {
		this.getItems(this.state.filter);
	}

	componentWillReceiveProps(nextProps) {   
		if (nextProps.filter !== this.props.filter || nextProps.forceRerender) {
			this.setState({ filter: nextProps.filter }, () => {
				this.getItems(this.state.filter);
			});
		} 
	}

	getItems(filter) {
		const self = this;
		const settings = {
			select: self.props.select,
			filter: filter || '',
			orderBy: 'Created desc',
			expand: this.props.expand.join()
		};

		this.site.ListItems(self.props.listName).query(settings).then(results => self.setState(
			{ allData: results, itemCount: results ? results.length : 0 },
			() => {
				if (self.state.itemCount > self.props.initialItemsCount) {
					self.setState({ data: self.state.allData.slice(0, self.state.viewItemsLimit) });
				} else {
					self.setState({ data: self.state.allData });
				}

				if (self.state.allData && self.state.allData.length > 0) {
					self.getAddPermissionsByLevel(PROJECTLIST, self.projectId);
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

	handleFetchData() {
		if (this.props.onFetchData) {
			this.props.onFetchData();
		}
	}

	getAddPermissionsByLevel(listName, itemId) {
		const self = this;

		$.when(GetPermissions(listName, itemId)).then((data) => {
			const results = (data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results : null);

			if (results && IfArrayContainsObject(results, 'Name', 'Full Control') !== -1) {
				self.setState({ userCanAdd: true });
			} else {
				self.getPermissionsByGroup(listName, itemId);
			} 
		}, (error) => { 
			self.getPermissionsByGroup(listName, itemId);
		});
	}

	getPermissionsByGroup(listName, projectId) {
		const self = this;

		if (projectId) {
			if (_spPageContextInfo.isSiteAdmin) {
				self.setState({ userCanAdd: true });
			} else {
				const settings = {
					select: 'ProjectLeaders/Id, ProjectLeaders/Title, ProjectMembers/Id, ProjectMembers/Title',
					filter: `Id eq ${projectId} and (ProjectLeaders/Id eq ${_spPageContextInfo.userId} or ProjectMembers/Id eq ${_spPageContextInfo.userId})`,
					expand: 'ProjectLeaders, ProjectMembers'
				};

				self.site.ListItems(listName).query(settings).then((results) => {
					if (results && results.length > 0) {
						self.setState({ userCanAdd: true });
					}	
				});
			}
		} 
	}

	render() {
		const data = this.state.data;

		const mainContent = data && data.length > 0 ? 
		(
			<CastThumbnailTile data={this.state.data} 
								listName={this.props.listName}
								expandedField={this.props.expandedField} 
								onFetchData={this.handleFetchData}
								parentComponentTitle={this.props.title}
								userCanAdd={this.state.userCanAdd}
								showOverlayPanel />
		) 
		: 
		(
			<span className={Styles.empty}>
				<h1>No casts...</h1>
			</span>
		);

		const showMore = this.state.itemCount > this.state.viewItemsLimit && data.length > 0 ?
		(
			<div className={`${Styles.showmore} ms-Grid-col ms-u-sm12`}>
				<Button value="Show more" 
						className={Styles.showmore_button} 
						onClick={this.handleShowMoreClick} />
			</div>
		) : null;

		return (
			<div className="ms-Grid container">
				<div className="ms-Grid-row">
					<div className={`ms-Grid-col ms-u-sm12 ${Styles.container}`}>	
						<div className={`${Styles.header} ms-Grid-row`}>
							<h1>{this.props.title}</h1>
						</div>
						<div className="ms-Grid-row">
							<div className="ms-Grid-col ms-u-sm12">	
								{mainContent}
								<div className="ms-Grid-row">
									{showMore}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CastThumbnail;