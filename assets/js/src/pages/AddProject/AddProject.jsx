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
import { RedirectToPage, GenerateGuid, GetAssetsPath } from '../../utils/utils';
import FormTextField from '../../components/Partials/FormFields/FormTextField/FormTextField';
import AdditionalInfoUpload from '../../components/AdditionalInfoUpload/AdditionalInfoUpload';
import FormDatePicker from '../../components/Partials/FormFields/FormDatePicker/FormDatePicker';
import FormDropDownField from '../../components/Partials/FormFields/FormDropDownField/FormDropDownField';

/* CSS styles */
import Styles from './AddProject.scss';

class AddProject extends React.Component {
	constructor() {
		super();

		this.state = {	
			users: [],
			clusters: [],
			noClusters: '',
			submitting: false,
			roleDefinitions: {},
			noProjectLeaders: '',
			noProjectMembers: '',
			submittingMessage: '',
			noProjectVisitors: '',
			clusterInternalName: '',
			showFieldsMessage: false,
			userCanAdd: false
		};

		this.projectId = 0;
		this.settings = {};
		this.validForm = true;	
		this.site = new SPOC.SP.Site();
		this.projectGuid = GenerateGuid();
		this.usersLabels = PageUtils.GetLabels('users');
		this.clustersLabels = PageUtils.GetLabels('clusters');

		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleUsersChanged = this.handleUsersChanged.bind(this);
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
		this.handleClustersChanged = this.handleClustersChanged.bind(this);
		this.handleDatePickerSelect = this.handleDatePickerSelect.bind(this);
		this.getStraplineErrorMessage = this.getStraplineErrorMessage.bind(this);
		this.getYearOfLaunchingErrorMessage = this.getYearOfLaunchingErrorMessage.bind(this);
	}

	componentDidMount() {
		this.checkAddPermissions();
	}

	checkAddPermissions() { 
		const self = this;

		let userCanAdd = false;
		let submittingMessage = '';

		if (_spPageContextInfo.isSiteAdmin) {
			userCanAdd = true; 
		} else {
			const permissions = new SP.BasePermissions();
			permissions.fromJson(_spPageContextInfo.webPermMasks);
			userCanAdd = permissions.has(SP.PermissionKind.addListItems); 
		}

		if (!userCanAdd) {
			submittingMessage = 'You don\'t have permissions to add a project.';
		} else {
			PageUtils.GetSiteGroupId(Settings.SITEOWNERSGROUP, self);
			PageUtils.GetRoleDefinitions(self);
			self.getUsers();
			self.getClusters();
		}

		self.setState({ userCanAdd, submittingMessage }); 
	} 

	getUsers() {
		const self = this;

		$.when(PageUtils.GetUsers()).then((data) => {
			const results = (data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results : null);

			if (results) {
				const users = results.map(item => ({ key: item.Id, name: item.Title }));
				self.setState({ users });
			} 
		}, (reason) => { console.log(reason); });
	}

	getClusters() {
		const self = this;

		self.getClusterInternalName();

		$.when(PageUtils.GetClusters(Settings.PROJECTLIST)).then((data) => {
			const results = data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results[0] : null;

			if (results) { 
				PageUtils.GetClustersValues('clusters', results.TermSetId, self);
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

	setTagsValues(tags, field) {
		PageUtils.SetTagsValues(tags, field, this.setSettingsValue, this);
	}

	addProject(settings) {
		const self = this;

		console.log(settings);

		self.site.ListItems(Settings.PROJECTLIST).create(settings).then(() => { 
			self.site.ListItems(Settings.PROJECTLIST)
						.query({
							select: 'Id',
							filter: `ProjectGuid eq '${self.projectGuid}'`
						})
						.then((results) => {
							if (results && results.length > 0) {								
								self.projectId = results[0].Id;

								self.setState({ submittingMessage: 'Assigning roles to project users...' });

								$.ajax({  
									url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getByTitle('${Settings.PROJECTLIST}')/getItemById(${self.projectId})/breakroleinheritance`,  
									type: 'POST',  
									headers: {  
										Accept: 'application/json;odata=verbose',  
										'content-Type': 'application/json;odata=verbose',  
										'X-RequestDigest': $('#__REQUESTDIGEST').val()  
									},  
									dataType: 'json',
									success: (data) => {
										const usersRoles = {
											ProjectLeaders: {
												users: settings.ProjectLeadersId.results,
												roles: 'Contribute'
											},
											ProjectMembers: {
												users: settings.ProjectMembersId.results,
												roles: 'Read'
											},
											ProjectVisitors: {
												users: settings.ProjectVisitorsId.results,
												roles: 'Read'
											},
											SiteOwners: {
												users: [self.state[Settings.SITEOWNERSGROUP]],
												roles: 'Full Control'
											}
										};
										
										PageUtils.AssignPermissionsToUsers(
											Settings.PROJECTLIST, 
											self.projectId, 
											usersRoles, 
											self.state.roleDefinitions, 
											self.addingPermissionsFinished, 
											self
										);
									},  
									error: (error) => {
										console.log(JSON.stringify(error));  
									}  
								}); 
							}
						});
		}, (error) => {  
			self.setState({ submitting: false, submittingMessage: JSON.parse(error.response).error.message.value });
		});
	}

	addingPermissionsFinished(self, data) {
		self.setState({ submittingMessage: 'Redirecting to a project page...' });

		const noRedirect = SPOC.Utils.Url.getQueryString('r');

		if (!noRedirect) { 
			RedirectToPage(`${self.site.url}${Settings.VIEWPROJECT}?pid=${self.projectId}`);	
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
						this.state.clusters.filter(tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0)
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

	handleTextboxChange(value, field) {
		this.setSettingsValue(value, field);
	}

	handleDatePickerSelect(value, field) {
		const selectedDate = Moment(value).toISOString();
		this.setSettingsValue(selectedDate, field);
	}

	handleSubmitClick() {
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
			this.setState({ submitting: true, submittingMessage: 'Creating a project...' }, () => {
				this.setSettingsValue(this.projectGuid, 'ProjectGuid');
				this.setClustersValues();
				this.setTagsValues(this.ProjectLeaders.state.items, 'ProjectLeadersId');
				this.setTagsValues(this.ProjectMembers.state.items, 'ProjectMembersId');
				this.setTagsValues(this.ProjectVisitors.state.items, 'ProjectVisitorsId');
				this.addProject(this.settings);
			});
		} else {
			$('#s4-workspace').animate({ scrollTop: 0 }, 1000);  
		}
	}

	render() {
		const submitButtonContent = this.state.submitting || this.state.submittingMessage ?
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
		) : <Button className={Styles.button} value="Submit" onClick={this.handleSubmitClick} />;

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

		const mainContent = this.state.userCanAdd ? 
		(
			<div>
				<div className={`${Styles.top_container} ms-Grid-row`}>
					<div className="container">
						{fieldsMessageContent}
						<div className="ms-Grid-row">
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm5">
								<FormTextField ref={(c) => { this.projectName = c; }} 
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
								<FormDropDownField label="Category" 
													field="ProjectCategory" 
													listName={Settings.PROJECTLIST}
													onChanged={this.handleDropDownChange} />
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
						<div className={`${Styles.description_container} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm6">
								<FormTextField label="Project Description" 
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
								<FormTextField label="Year of launching" 
												field="YearOfLaunching" 
												onGetErrorMessage={this.getYearOfLaunchingErrorMessage} 
												onChange={this.handleTextboxChange} />
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
						<div className="ms-Grid-row">
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm5">
								<FormDatePicker label="Project Start Date" 
												field="ProjectStartDate" 
												onSelectDate={this.handleDatePickerSelect} />
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
						<div className={`${Styles.additional_info} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm12">
								<AdditionalInfoUpload listName={Settings.PROJECTADDITIONALINFO} 
														customPathInputClass="ms-Grid-col ms-u-md5 ms-u-sm12"
														onUploadChange={this.handleUploadChange} />
							</div>
						</div>
						<div className={`${Styles.tags_container} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm3" />
							<div className="ms-Grid-col ms-u-sm6">
								<div className="ms-Grid-row">
									<div className={`${Styles.tag_label} ms-Grid-col ms-u-sm12`}>
										Clusters (NA, EU, Latam, SEA, SA, NAMET, China, Others)<span style={{ color: 'red' }}>*</span>:
									</div>
									<div className={`${Styles.tag_value} ms-Grid-col ms-u-sm12`}>
										<TagPicker ref={(c) => { this.Clusters = c; }} 
													onResolveSuggestions={this.handleClustersChanged}
													getTextFromItem={item => item.name}
													pickerSuggestionsProps={this.clustersLabels}
													className={this.state.noClusters} />
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
										<TagPicker ref={(c) => { this.ProjectLeaders = c; }} 
													onResolveSuggestions={this.handleUsersChanged}
													getTextFromItem={item => item.name}
													pickerSuggestionsProps={this.usersLabels}
													className={this.state.noProjectLeaders} />
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
										<TagPicker ref={(c) => { this.ProjectMembers = c; }} 
													onResolveSuggestions={this.handleUsersChanged}
													getTextFromItem={item => item.name}
													pickerSuggestionsProps={this.usersLabels}
													className={this.state.noProjectMembers} />
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
										<TagPicker ref={(c) => { this.ProjectVisitors = c; }} 
													onResolveSuggestions={this.handleUsersChanged}
													getTextFromItem={item => item.name}
													pickerSuggestionsProps={this.usersLabels}
													className={this.state.noProjectVisitors} />
									</div>
								</div>
							</div>
							<div className="ms-Grid-col ms-u-sm3" />
						</div>
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
								Add Project
							</div>
						</div>
					</div>
					{
						!this.state.userCanAdd ? <div className={`${Styles.top_container} ms-Grid-row`} /> : null
					}
					{mainContent}
					<div className={`${Styles.submit} ms-Grid-row container`} style={!this.state.userCanAdd ? { paddingTop: 0 } : {}}>
						<div className="ms-Grid-col ms-u-sm12">
							{submitButtonContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddProject;