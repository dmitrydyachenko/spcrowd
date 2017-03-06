/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';
import Moment from 'moment';

/* Components */
import SearchCasts from '../../components/SearchCasts/SearchCasts';
import CastThumbnail from '../../components/CastThumbnail/CastThumbnail';
import { GetPermissions, IfArrayContainsObject } from '../../utils/utils';
import FormDropDownField from '../../components/Partials/FormFields/FormDropDownField/FormDropDownField';
import { PROJECTLIST, PROJECTSHORTLIST, PROJECTSELECTIONSLIST, EDITPROJECT } from '../../utils/settings';

/* CSS styles */
import Styles from './ViewProject.scss';

class ViewProject extends React.Component {
	static propTypes = {
		id: React.PropTypes.string,
		select: React.PropTypes.string
	};

	static defaultProps = {	
		id: SPOC.Utils.Url.getQueryString('pid'),
		select: 'Id, Title, Strapline, ProjectClusters, ProjectCategory, YearOfLaunching, ' + 
				'ProjectStartDate, ProjectLeaders/EMail, AdditionalInfo, ProjectStatus'
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			message: 'Loading...',
			filterProjectCasts: `ProjectId/Id eq ${this.props.id}`,
			forceRerender: false,
			clusters: [],
			userCanEdit: false
		};
		this.site = new SPOC.SP.Site();
		this.expandProjectsCasts = ['CastId', 'ProjectId'];
		this.selectProjectCasts = 'Id, CastId/Id, CastId/CastName, CastId/ProfilePhoto, ProjectId/Id, ProjectClusters';
		this.handleFetchData = this.handleFetchData.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
	}

	componentDidMount() {
		this.getItems(this.props.id);
	}

	getItems(id) {
		if (id) {
			const self = this;

			const settings = {
				select: self.props.select,
				filter: `Id eq ${id}`,
				expand: 'ProjectLeaders'
			};

			this.site.ListItems(PROJECTLIST)
						.query(settings)
						.then(data => self.setState({ data }, () => {
							const results = this.state.data;

							if (results && results.length > 0) {
								self.getEditPermissionsByLevel(PROJECTLIST, id);

								const cluster = results[0].ProjectClusters;

								if (cluster) {
									const clusterResults = cluster.results;

									clusterResults.push({ key: 0, text: '', termGuid: '' });
									
									const clusters = clusterResults.map(item => ({ key: item.WssId, text: item.Label, termGuid: item.TermGuid }));

									self.setState({ clusters });
								}
							} else {
								self.setState({ message: 'You don\'t have permissions to view this project or it has been deleted.' });
							}
						}));
		}
	}

	getEditPermissionsByLevel(listName, itemId) {
		const self = this;

		$.when(GetPermissions(listName, itemId)).then((data) => {
			const results = (data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results : null);

			if (results && (IfArrayContainsObject(results, 'Name', 'Full Control') !== -1 || 
							IfArrayContainsObject(results, 'Name', 'Contribute') !== -1)) {
				self.setState({ userCanEdit: true });
			} else {
				self.getPermissionsByGroup(listName, itemId, 'ProjectLeaders', 'userCanEdit');
			} 
		}, (error) => { 
			self.getPermissionsByGroup(listName, itemId, 'ProjectLeaders', 'userCanEdit');
		});
	}

	getPermissionsByGroup(listName, itemId, groupName, statePermission) {
		const self = this;

		if (_spPageContextInfo.isSiteAdmin) {
			self.setState({ [statePermission]: true });
		} else {
			const settings = {
				select: `${groupName}/Id, ${groupName}/Title`,
				filter: `Id eq ${itemId} and ${groupName}/Id eq ${_spPageContextInfo.userId}`,
				expand: groupName
			};

			self.site.ListItems(listName).query(settings).then((results) => {
				if (results && results.length > 0) {
					self.setState({ [statePermission]: true });
				}	
			});
		}
	}

	handleFetchData() {
		this.expandProjectsCasts = ['CastId', 'ProjectId'];
		this.selectProjectCasts = 'Id, CastId/Id, CastId/CastName, CastId/ProfilePhoto, ProjectId/Id, ProjectClusters';
		this.setState({ forceRerender: true });
	}

	handleDropDownChange(value, field, fieldType) {
		if (value.text) {
			this.selectProjectCasts = 'Id, CastId/Id, CastId/CastName, CastId/ProfilePhoto, ProjectId/Id, TaxCatchAll/Term, ProjectClusters';
			this.expandProjectsCasts = ['TaxCatchAll', 'CastId', 'ProjectId'];
			this.setState({ filterProjectCasts: `ProjectId/Id eq ${this.props.id} and TaxCatchAll/Term eq '${value.text}'`, forceRerender: false });
		} else {
			this.expandProjectsCasts = ['CastId', 'ProjectId'];
			this.selectProjectCasts = 'Id, CastId/Id, CastId/CastName, CastId/ProfilePhoto, ProjectId/Id, ProjectClusters';
			this.setState({ filterProjectCasts: `ProjectId/Id eq ${this.props.id}`, forceRerender: false });
		}
	}

	render() {
		const self = this;
		const data = self.state.data;
		const show = data && data.length > 0;

		let mainContent = (
			<span className={Styles.empty}>
				<h1>{self.state.message}</h1>
			</span>
		);

		if (show) {
			const item = data[0];

			const editContent = self.state.userCanEdit ?
			(
				<div className={`${Styles.editlink} ms-Grid-col ms-u-sm12`}>
					<a href={`${_spPageContextInfo.siteAbsoluteUrl}${EDITPROJECT}?pid=${self.props.id}`}>
						edit project
					</a>
				</div>
			) : null;

			const headerContent = (
				<div className="container">
					<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
						{item.Title}
					</div>
					<div className={`${Styles.category} ms-Grid-col ms-u-sm12`}>
						{item.ProjectCategory}
					</div>
					{editContent}
					<div className={`${Styles.strapline} ms-Grid-col ms-u-sm12`}>
						{item.Strapline}
					</div>
				</div>
			);

			let clusterContent = null;

			if (item.ProjectClusters) {
				clusterContent = item.ProjectClusters.results.map((cluster, i) => 
					<div key={i}>{cluster.Label}<br /></div>
				); 
			}

			let projectLeadersContent = null;

			if (item.ProjectLeaders && item.ProjectLeaders.results) {
				projectLeadersContent = item.ProjectLeaders.results.map((projectLeader, i) => 
					<div className={Styles.email} key={i}>
						<a href={`mailto:${projectLeader.EMail}`}>{projectLeader.EMail}</a>
						<br />
					</div>
				); 
			}

			let additionalInfoContent = null;

			if (item.AdditionalInfo && item.AdditionalInfo.Url && item.AdditionalInfo.Description) {
				additionalInfoContent = <a href={item.AdditionalInfo.Url}>{item.AdditionalInfo.Description}</a>;
			}

			mainContent = (
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						{headerContent}
					</div>
					<div className={`${Styles.info_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.info} ms-Grid-col ms-u-sm12`}>
								<div className={`${Styles.project_status} ms-Grid-row`}>
									<div className={`${Styles.label} ms-Grid-col ms-u-sm6`}>
										Project Status:
									</div>
									<div className={`${Styles.value} ms-Grid-col ms-u-sm6`}>
										{item.ProjectStatus}
									</div>
								</div>
								<div className={`${Styles.year_of_launching} ms-Grid-row`}>
									<div className={`${Styles.label} ms-Grid-col ms-u-sm6`}>
										Year of launching:
									</div>
									<div className={`${Styles.value} ms-Grid-col ms-u-sm6`}>
										{item.YearOfLaunching}
									</div>
								</div>
								<div className={`${Styles.project_start_date} ms-Grid-row`}>
									<div className={`${Styles.label} ms-Grid-col ms-u-sm6`}>
										Project start date:
									</div>
									<div className={`${Styles.value} ms-Grid-col ms-u-sm6`}>
										{item.ProjectStartDate ? Moment(item.ProjectStartDate).format('DD/MM/YYYY') : ''}
									</div>
								</div>
								<div className={`${Styles.cluster} ms-Grid-row`}>
									<div className={`${Styles.label} ms-Grid-col ms-u-sm6`}>
										Clusters:
									</div>
									<div className={`${Styles.value} ms-Grid-col ms-u-sm6`}>
										{clusterContent}
									</div>
								</div>
								<div className={`${Styles.additional_info} ms-Grid-row`}>
									<div className={`${Styles.label} ms-Grid-col ms-u-sm6`}>
										Additional info:
									</div>
									<div className={`${Styles.value} ms-Grid-col ms-u-sm6`}>
										{additionalInfoContent}
									</div>
								</div>
								<div className={`${Styles.project_leaders} ms-Grid-row`}>
									<div className={`${Styles.label} ms-Grid-col ms-u-sm6`}>
										Project leaders:
									</div>
									<div className={`${Styles.value} ms-Grid-col ms-u-sm6`}>
										{projectLeadersContent}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={Styles.added_casts}>
						<div className={`${Styles.topcurve} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm12" />
						</div>
						<div className={`${Styles.cluster_filter} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm4">
								{
									self.state.clusters && self.state.clusters.length > 0 ?
									(
										<FormDropDownField label="Filter by cluster" 
															field="ProjectCluster" 
															values={self.state.clusters}
															onChanged={self.handleDropDownChange} />
									) : null
								}
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
						<div className={`${Styles.selected_casts} ms-Grid-row`}>
							<CastThumbnail title="Selected Casts" 
											select={self.selectProjectCasts}
											filter={self.state.filterProjectCasts} 
											expand={self.expandProjectsCasts}
											listName={PROJECTSELECTIONSLIST}
											expandedField="CastId"
											initialItemsCount={5}
											forceRerender={self.state.forceRerender}
											onFetchData={self.handleFetchData} />
						</div>
						<div className={`${Styles.topcurve} ${Styles.grey} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm12" />
						</div>
						<div className={`${Styles.shortlisted_casts} ms-Grid-row`}>
							<CastThumbnail title="Shortlisted Casts" 
											select={self.selectProjectCasts}
											filter={self.state.filterProjectCasts}  
											expand={self.expandProjectsCasts}
											listName={PROJECTSHORTLIST}
											expandedField="CastId"
											initialItemsCount={5}
											forceRerender={self.state.forceRerender}
											onFetchData={self.handleFetchData} />
						</div>
					</div>
					<div className={`${Styles.search_container} ms-Grid-row`}>
						<SearchCasts onFetchData={self.handleFetchData} showResults />
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

export default ViewProject;