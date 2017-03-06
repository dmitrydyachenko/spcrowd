/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';
import Moment from 'moment';

/* Components */
import { TagPicker } from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagPicker';
import * as PageUtils from '../PageUtils';
import * as Settings from '../../utils/settings';
import Button from '../../components/Partials/Button/Button';
import CastThumbnail from '../../components/CastThumbnail/CastThumbnail';
import { RedirectToPage, GetAssetsPath, ArrayAdiff } from '../../utils/utils';
import FormTextField from '../../components/Partials/FormFields/FormTextField/FormTextField';
import AdditionalInfoUpload from '../../components/AdditionalInfoUpload/AdditionalInfoUpload';
import FormDatePicker from '../../components/Partials/FormFields/FormDatePicker/FormDatePicker';
import FormDropDownField from '../../components/Partials/FormFields/FormDropDownField/FormDropDownField';

/* CSS styles */
import Styles from './EditProject.scss';

class EditProject extends React.Component {
	static propTypes = {
		id: React.PropTypes.string,
		select: React.PropTypes.string
	};

	static defaultProps = {	
		id: SPOC.Utils.Url.getQueryString('pid'),
		select: 'Id, Title, Strapline, ProjectClusters, AdditionalInfo, ProjectCategory, YearOfLaunching, ' + 
				'ProjectStartDate, ProjectLeaders/Id, ProjectMembers/Id, ProjectVisitors/Id, ' +
				'ProjectLeaders/Title, ProjectMembers/Title, ProjectVisitors/Title, ProjectStatus'  
	};

	constructor(props) {
		super(props);

		this.state = {	
			data: [],
			users: [],
			clusters: [],
			noClusters: '',
			allClusters: [],
			submitting: false,
			roleDefinitions: {},
			forceRerender: false,
			noProjectLeaders: '',
			noProjectMembers: '',
			noProjectVisitors: '',
			submittingMessage: '',
			clusterInternalName: '',
			showFieldsMessage: false,
			filterProjectCasts: `ProjectId/Id eq ${this.props.id}`
		};

		this.item = null;
		this.settings = {};
		this.validForm = true;
		this.site = new SPOC.SP.Site();
		this.usersLabels = PageUtils.GetLabels('users');
		this.expandProjectsCasts = ['CastId', 'ProjectId'];
		this.clustersLabels = PageUtils.GetLabels('clusters');
		this.selectProjectCasts = 'Id, CastId/Id, CastId/CastName, CastId/ProfilePhoto, ProjectId/Id, ProjectClusters';
		
		this.handleFetchData = this.handleFetchData.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
		this.handleUsersChanged = this.handleUsersChanged.bind(this);
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleClustersChanged = this.handleClustersChanged.bind(this);
		this.handleDatePickerSelect = this.handleDatePickerSelect.bind(this);
		this.getStraplineErrorMessage = this.getStraplineErrorMessage.bind(this);
		this.handleClustersDropDownChange = this.handleClustersDropDownChange.bind(this);
		this.getYearOfLaunchingErrorMessage = this.getYearOfLaunchingErrorMessage.bind(this);
	}

	componentDidMount() {
		PageUtils.GetRoleDefinitions(this);
		this.getItems(this.props.id);
	}

	getItems(id) {
		if (id) {
			const self = this;
			const settings = {
				select: self.props.select,
				filter: `Id eq ${id}`,
				expand: 'ProjectLeaders, ProjectMembers, ProjectVisitors'
			};

			this.site.ListItems(Settings.PROJECTLIST)
					.query(settings)
					.then(data => self.setState({ data }, () => {
						const stateData = self.state.data;
						const show = stateData && stateData.length > 0;
						const item = show ? stateData[0] : null;

						self.item = item;

						self.getUsers();
						self.getClusters();
					}));
		}
	}

	getUsers() {
		const self = this;

		$.when(PageUtils.GetUsers()).then((data) => {
			const results = (data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results : null);

			if (results) {
				const users = results.map(item => ({ key: item.Id, name: item.Title }));

				self.setState({ users }, () => {
					if (self.item) {
						self.collectProjectUsers(self.item, 'ProjectLeaders');
						self.collectProjectUsers(self.item, 'ProjectMembers');
						self.collectProjectUsers(self.item, 'ProjectVisitors');
					}
				});
			} 
		}, (reason) => { console.log(reason); });
	}

	collectProjectUsers(item, projectUsers) {
		if (item[projectUsers] && item[projectUsers].results) {
			const selectedUsers = [];

			item[projectUsers].results.forEach((user) => {
				selectedUsers.push({ key: user.Id, name: user.Title });
			});

			this.setState({ [projectUsers]: selectedUsers });
		}
	}

	getClusters() {
		const self = this;

		self.getClusterInternalName();

		$.when(PageUtils.GetClusters(Settings.PROJECTLIST)).then((data) => {
			const results = data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results[0] : null;

			if (results) { 
				PageUtils.GetClustersValues('allClusters', results.TermSetId, self, () => {
					const stateData = self.state.data;
					const show = stateData && stateData.length > 0;
					const item = show ? stateData[0] : null;

					if (item && item.ProjectClusters && item.ProjectClusters.results) {
						const clusters = item.ProjectClusters.results.map(cluster => ({ 
							key: cluster.TermGuid, 
							name: cluster.Label, 
							text: cluster.Label, 
							termGuid: cluster.TermGuid 
						}));
						self.setState({ clusters });
					}
				});
			}
		}, (reason) => { console.log(reason); });
	}

	getClusterInternalName() {
		const self = this;

		$.when(PageUtils.GetClusterInternalName(Settings.PROJECTLIST)).then((data) => {
			const clusterInternalName = data && data.d && data.d.InternalName ? data.d.InternalName : null;

			if (clusterInternalName) {
				self.setState({ clusterInternalName });
			}  
		}, (reason) => { console.log(reason); });
	}

	setClustersValues() { 
		PageUtils.SetClustersValues(this.Clusters.state.items, this.state.clusterInternalName, this.setSettingsValue, this);
	}

	setTagsValues(tags, field) {
		PageUtils.SetTagsValues(tags, field, this.setSettingsValue, this);
	}

	getYearOfLaunchingErrorMessage(value) {
		return PageUtils.GetYearOfLaunchingErrorMessage(value);
	}

	getStraplineErrorMessage(value) {
		return PageUtils.GetStraplineErrorMessage(value);
	}

	setSettingsValue(value, field, self) {
		const _self = self || this;

		_self.settings[field] = value;
		
		if (!value) {
			delete _self.settings[field];
		}
	}

	updateProject(settings) {
		const self = this;

		console.log(settings);

		self.site.ListItems(Settings.PROJECTLIST).update(self.props.id, settings).then(() => { 
			self.setState({ submittingMessage: 'Assigning roles to project users...' });

			const l = ArrayAdiff(self.item.ProjectLeaders.results.map(i => i.Id), settings.ProjectLeadersId.results);
			const m = ArrayAdiff(self.item.ProjectMembers.results.map(i => i.Id), settings.ProjectMembersId.results);
			const v = ArrayAdiff(self.item.ProjectVisitors.results.map(i => i.Id), settings.ProjectVisitorsId.results);

			const usersRolesToRemove = {
				ProjectLeaders: {
					users: l,
					roles: 'Contribute'
				},
				ProjectMembers: {
					users: m,
					roles: 'Read'
				},
				ProjectVisitors: {
					users: v,
					roles: 'Read'
				}
			};

			PageUtils.AssignPermissionsToUsers(
				Settings.PROJECTLIST, 
				self.props.id, 
				usersRolesToRemove, 
				self.state.roleDefinitions, 
				self.removingPermissionsFinished, 
				self,
				'remove'
			);
		}, (error) => {  
			self.setState({ submitting: false, submittingMessage: JSON.parse(error.response).error.message.value });
		});
	}

	removingPermissionsFinished(self, data) {
		const settings = self.settings;

		const l = ArrayAdiff(settings.ProjectLeadersId.results, self.item.ProjectLeaders.results.map(i => i.Id));
		const m = ArrayAdiff(settings.ProjectMembersId.results, self.item.ProjectMembers.results.map(i => i.Id));
		const v = ArrayAdiff(settings.ProjectVisitorsId.results, self.item.ProjectVisitors.results.map(i => i.Id));

		const usersRolesToAdd = {
			ProjectLeaders: {
				users: l,
				roles: 'Contribute'
			},
			ProjectMembers: {
				users: m,
				roles: 'Read'
			},
			ProjectVisitors: {
				users: v,
				roles: 'Read'
			}
		};

		PageUtils.AssignPermissionsToUsers(
			Settings.PROJECTLIST, 
			self.props.id, 
			usersRolesToAdd, 
			self.state.roleDefinitions, 
			self.addingPermissionsFinished, 
			self
		);
	}

	addingPermissionsFinished(self, data) {
		self.setState({ submittingMessage: 'Redirecting to a project page...' });

		const noRedirect = SPOC.Utils.Url.getQueryString('r');

		if (!noRedirect) { 
			RedirectToPage(`${self.site.url}${Settings.VIEWPROJECT}?pid=${self.props.id}`);	
		}
	}

	handleUsersChanged(filterText: string, tagList: { key: string, name: string }[]) {
		const results = filterText ? 
						this.state.users.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
									.filter(item => !this.listContainsDocument(item, tagList)) : [];
		return results;
	}

	handleClustersChanged(filterText: string, tagList: { key: string, name: string }[]) {
		const results = filterText ? 
						this.state.allClusters.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
											.filter(item => !this.listContainsDocument(item, tagList)) : [];
		return results;
	}

	listContainsDocument(tag: { key: string, name: string }, tagList: { key: string, name: string }[]) {
		if (!tagList || !tagList.length || tagList.length === 0) {
			return false;
		}

		return tagList.filter(compareTag => compareTag.key === tag.key).length > 0;
	}

	handleUploadChange(file, isTextField) {
		const value = isTextField ? file.value : {
			__metadata: { 
				type: 'SP.FieldUrlValue'
			},
			Url: file ? file.path : '', 
			Description: file ? file.name : ''
		};

		this.setSettingsValue(value, file.field);
	}

	handleDropDownChange(value, field, fieldType) {
		let finalValue = '';
		let finalField = '';

		if (fieldType === 'MultiChoice') {
			finalValue = {
				__metadata: {
					type: 'Collection(Edm.String)'
				},
				results: [value.text]
			};
		} else if (fieldType === 'Choice') {
			finalValue = value.text;
		} else if (fieldType === 'Boolean') {
			finalValue = (value.text === 'Yes');
		} else if (fieldType === 'Lookup') {
			finalField = `${field}Id`;
			finalValue = value.Id;
		} 

		this.setSettingsValue(finalValue, finalField || field);
	}

	handleFetchData() {
		this.expandProjectsCasts = ['CastId', 'ProjectId'];
		this.selectProjectCasts = 'Id, CastId/Id, CastId/CastName, CastId/ProfilePhoto, ProjectId/Id, ProjectClusters';
		this.setState({ forceRerender: true });
	}

	handleClustersDropDownChange(value, field, fieldType) {
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

	handleTextboxChange(value, field) {
		this.setSettingsValue(value, field);
	}

	handleDatePickerSelect(value, field) {
		const selectedDate = Moment(value).toISOString();
		this.setSettingsValue(selectedDate, field);
	}

	handleSaveClick() {
		this.validForm = true;
		
		this.setState({ 
			noProjectLeaders: '', 
			noProjectMembers: '', 
			noProjectVisitors: '', 
			noClusters: '', 
			showFieldsMessage: false 
		});

		if (!this.projectName.validate()) {
			this.validForm = false;
		}

		if (this.Clusters.state.items.length === 0) {
			this.validForm = false;
			this.setState({ noClusters: Styles.error, showFieldsMessage: true });
		}

		if (this.ProjectLeaders.state.items.length === 0) {
			this.validForm = false;
			this.setState({ noProjectLeaders: Styles.error, showFieldsMessage: true });
		}

		if (this.ProjectMembers.state.items.length === 0) {
			this.validForm = false;
			this.setState({ noProjectMembers: Styles.error, showFieldsMessage: true });
		}

		if (this.ProjectVisitors.state.items.length === 0) {
			this.validForm = false;
			this.setState({ noProjectVisitors: Styles.error, showFieldsMessage: true });
		}

		if (this.validForm) { 
			this.setState({ submitting: true, submittingMessage: 'Updating a project...' }, () => {
				this.setClustersValues();
				this.setTagsValues(this.ProjectLeaders.state.items, 'ProjectLeadersId');
				this.setTagsValues(this.ProjectMembers.state.items, 'ProjectMembersId');
				this.setTagsValues(this.ProjectVisitors.state.items, 'ProjectVisitorsId');
				this.updateProject(this.settings);
			});
		} else {
			$('#s4-workspace').animate({ scrollTop: 0 }, 1000);  
		}
	}

	getUsersContent(users) {
		if (this.state[users] && this.state[users].length > 0) {
			return (
				<TagPicker ref={(c) => { this[users] = c; }} 
							defaultSelectedItems={this.state[users]}
							onResolveSuggestions={this.handleUsersChanged}
							getTextFromItem={tag => tag.name}
							pickerSuggestionsProps={this.usersLabels}
							className={this.state[`no${users}`]} />
			);
		} 

		return null;
	}

	getClustersContent(clusters) {
		if (clusters && clusters.length > 0) {
			return (
				<TagPicker ref={(c) => { this.Clusters = c; }} 
							defaultSelectedItems={clusters}
							onResolveSuggestions={this.handleClustersChanged}
							getTextFromItem={tag => tag.name}
							pickerSuggestionsProps={this.clustersLabels}
							className={this.state.noClusters} />
			);
		} 

		return null;
	}

	render() {
		const data = this.state.data;
		const show = data && data.length > 0;
		const item = show ? data[0] : null;

		const saveButtonContent = this.state.submitting || this.state.submittingMessage ? 
		(
			<div className="ms-Grid-row">
				{
					this.state.submitting ? 
					(
						<div className="ms-Grid-col ms-u-sm12">
							<img src={`${GetAssetsPath() + Settings.IMGPATH}/loader.gif`} role="presentation" />
						</div>
					) : null
				}
				{
					this.state.submittingMessage ?
					(
						<div className={`${Styles.submitting_message} ms-Grid-col ms-u-sm12`}>
							{this.state.submittingMessage}
						</div>
					) : null
				}
			</div>
		) : <Button className={Styles.button} value="Save" onClick={this.handleSaveClick} />;

		const fieldsMessageContent = this.state.showFieldsMessage ?
		(
			<div className="ms-Grid-row">
				<div className="ms-Grid-col ms-u-sm12">
					<div className={Styles.fields_message}>
						Fill mandatory fields
					</div>
				</div>
			</div>

		) : null;

		return (
			<div className={Styles.container}>
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								Edit Project
							</div>
						</div>
					</div>
					<div className={`${Styles.top_container} ms-Grid-row`}>
						<div className="container">
							{fieldsMessageContent}
							<div className="ms-Grid-row">
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm5">
									<FormTextField ref={(c) => { this.projectName = c; }} 
													item={item}
													label="Project Name" 
													field="Title" 
													onChange={this.handleTextboxChange}
													errorMessage=""
													required />
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className="ms-Grid-row">
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm5">
									{
										item ? 
										(
											<FormDropDownField item={item}
																label="Category" 
																field="ProjectCategory" 
																listName={Settings.PROJECTLIST}
																onChanged={this.handleDropDownChange} />
										) : null
									}
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className={`${Styles.status_container} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm5">
									{
										item ?
										(
											<FormDropDownField item={item}
																label="Project Status" 
																field="ProjectStatus" 
																listName={Settings.PROJECTLIST}
																onChanged={this.handleDropDownChange} />
										) : null
									}
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className={`${Styles.description_container} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm6">
									<FormTextField item={item}
													label="Project Description" 
													field="Strapline" 
													onGetErrorMessage={this.getStraplineErrorMessage}
													customClass="ms-Grid-col ms-u-sm12"
													onChange={this.handleTextboxChange} />
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
						</div>
					</div>
					<div className={`${Styles.bottom_container} ms-Grid-row`}>
						<div className="container">
							<div className="ms-Grid-row">
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm5">
									<FormTextField item={item}
													label="Year of launching" 
													field="YearOfLaunching" 
													onGetErrorMessage={this.getYearOfLaunchingErrorMessage} 
													onChange={this.handleTextboxChange} />
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className="ms-Grid-row">
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm5">
									<FormDatePicker item={item}
													label="Project Start Date" 
													field="ProjectStartDate" 
													onSelectDate={this.handleDatePickerSelect} />
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className={`${Styles.additional_info} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm12">
									<AdditionalInfoUpload listName={Settings.PROJECTADDITIONALINFO} 
															item={item}
															customPathInputClass="ms-Grid-col ms-u-md5 ms-u-sm12"	
															onUploadChange={this.handleUploadChange} />
								</div>
							</div>
							<div className={`${Styles.tags_container} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm6">
									<div className="ms-Grid-row">
										<div className={`${Styles.tag_label} ms-Grid-col ms-u-sm12`}>
											Clusters<span style={{ color: 'red' }}>*</span>:
										</div>
										<div className={`${Styles.tag_value} ms-Grid-col ms-u-sm12`}>
											{this.getClustersContent(this.state.clusters)}
										</div>
									</div>
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className={`${Styles.tags_container} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm6">
									<div className="ms-Grid-row">
										<div className={`${Styles.tag_label} ms-Grid-col ms-u-sm12`}>
											Project Leaders<span style={{ color: 'red' }}>*</span>:
										</div>
										<div className={`${Styles.tag_value} ms-Grid-col ms-u-sm12`}>
											{this.getUsersContent('ProjectLeaders')}
										</div>
									</div>
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className={`${Styles.tags_container} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm6">
									<div className="ms-Grid-row">
										<div className={`${Styles.tag_label} ms-Grid-col ms-u-sm12`}>
											Project Members<span style={{ color: 'red' }}>*</span>:
										</div>
										<div className={`${Styles.tag_value} ms-Grid-col ms-u-sm12`}>
											{this.getUsersContent('ProjectMembers')}
										</div>
									</div>
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
							<div className={`${Styles.tags_container} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm3" />
								<div className="ms-Grid-col ms-u-sm6">
									<div className="ms-Grid-row">
										<div className={`${Styles.tag_label} ms-Grid-col ms-u-sm12`}>
											Project Visitors<span style={{ color: 'red' }}>*</span>:
										</div>
										<div className={`${Styles.tag_value} ms-Grid-col ms-u-sm12`}>
											{this.getUsersContent('ProjectVisitors')}
										</div>
									</div>
								</div>
								<div className="ms-Grid-col ms-u-sm3" />
							</div>
						</div>
					</div>
					<div className={`${Styles.save} ms-Grid-row container`}>
						<div className="ms-Grid-col ms-u-sm12">
							{saveButtonContent}
						</div>
					</div>
					<div className={Styles.added_casts}>
						<div className={`${Styles.topcurve} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm12" />
						</div>
						<div className={`${Styles.cluster_filter} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm4">
								<FormDropDownField label="Filter by cluster" 
													field="ProjectCluster" 
													values={this.state.clusters.concat([{ 
														key: 0, 
														text: '', 
														termGuid: ''
													}])}
													onChanged={this.handleClustersDropDownChange} />
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
						<div className={`${Styles.selected_casts} ms-Grid-row`}>
							<CastThumbnail title="Selected Casts" 
											select={this.selectProjectCasts}
											filter={this.state.filterProjectCasts} 
											expand={this.expandProjectsCasts}
											listName={Settings.PROJECTSELECTIONSLIST}
											expandedField="CastId"
											initialItemsCount={5}
											forceRerender={this.state.forceRerender}
											onFetchData={this.handleFetchData} />
						</div>
						<div className={`${Styles.topcurve} ${Styles.grey} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm12" />
						</div>
						<div className={`${Styles.shortlisted_casts} ms-Grid-row`}>
							<CastThumbnail title="Shortlisted Casts" 
											select={this.selectProjectCasts}
											filter={this.state.filterProjectCasts}  
											expand={this.expandProjectsCasts}
											listName={Settings.PROJECTSHORTLIST}
											expandedField="CastId"
											initialItemsCount={5}
											forceRerender={this.state.forceRerender}
											onFetchData={this.handleFetchData} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EditProject;