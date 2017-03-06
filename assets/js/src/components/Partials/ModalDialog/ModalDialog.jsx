/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';
import ReactModal from 'react-modal';

/* Components */
import Button from '../Button/Button';
import FormDropDownField from '../FormFields/FormDropDownField/FormDropDownField';
import { PROJECTLIST, PROJECTSHORTLIST } from '../../../utils/settings';

/* CSS styles */
import Styles from './ModalDialog.scss';

class ModalDialog extends React.Component {
	static propTypes = {
		onAddToProject: React.PropTypes.func.isRequired,
		onCloseModal: React.PropTypes.func.isRequired,
		showModal: React.PropTypes.bool.isRequired,
		title: React.PropTypes.string.isRequired,
		castId: React.PropTypes.string
	};
	constructor(props) {
		super(props);
		this.state = {
			showModal: props.showModal || false,
			clusters: [],
			message: '',
			selectedProject: {},
			selectedCluster: {},
			userCanAdd: false
		};
		this.projectId = SPOC.Utils.Url.getQueryString('pid');
		this.site = new SPOC.SP.Site();
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleClustersChange = this.handleClustersChange.bind(this);
		this.handleProjectsChange = this.handleProjectsChange.bind(this);
		this.handleAddToProject = this.handleAddToProject.bind(this);
	}

	componentWillMount() {
		ReactModal.setAppElement('body');
	}

	componentDidMount() {
		this.init();
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ showModal: nextProps.showModal }, () => {
			this.init();
		});
	}

	init() {
		if (this.projectId && this.state.showModal) {
			this.getProjectClusters(this.projectId);
		}
	}

	handleCloseModal() {
		this.setState({ 
			selectedProject: {},
			selectedCluster: {} 
		}, () => {
			this.props.onCloseModal();
		});
	}

	handleAddToProject() {
		const self = this;	
		const selectedProject = self.state.selectedProject;

		if (selectedProject && Object.keys(selectedProject).length > 0 && self.props.castId) {
			$.ajax({
				url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getbytitle('${PROJECTSHORTLIST}')/Fields/GetByTitle('ProjectClusters_0')/InternalName`,
				type: 'GET',
				contentType: 'application/json;odata=verbose',
				headers: {
					Accept: 'application/json;odata=verbose'
				},
				success: (data) => {
					const internalName = (data && data.d && data.d.InternalName ? data.d.InternalName : null);

					if (internalName) {
						const selectedCluster = self.state.selectedCluster;

						const settings = {
							ProjectIdId: selectedProject.key,
							CastIdId: self.props.castId,
							[internalName]: `${selectedCluster.key};#${selectedCluster.text}|${selectedCluster.termGuid}`
						};

						self.site.ListItems(PROJECTSHORTLIST).create(settings).then(() => { 
							self.setState({ 
								selectedProject: {},
								selectedCluster: {} 
							}, () => {
								self.props.onAddToProject(selectedProject);
							});
						});
					}                            
				}
			});  
		} else {
			console.log('SelectedProject object is empty or null');
		}
	}

	handleProjectsChange(value, field, fieldType) {
		const self = this;

		self.setState({ selectedProject: value, clusters: [] }, () => {
			self.getAddPermissionsByGroup(PROJECTLIST, value.Id);
		});
	}

	handleClustersChange(value, field, fieldType) {
		this.setState({ selectedCluster: value });
	}

	getAddPermissionsByGroup(listName, projectId) {
		const self = this;

		if (projectId) {
			if (_spPageContextInfo.isSiteAdmin) {
				self.setState({ 
					userCanAdd: true
				}, () => {
					self.getProjectClusters(projectId);
				});
			} else {
				const settings = {
					select: 'ProjectLeaders/Id, ProjectLeaders/Title, ProjectMembers/Id, ProjectMembers/Title',
					filter: `Id eq ${projectId} and (ProjectLeaders/Id eq ${_spPageContextInfo.userId} or ProjectMembers/Id eq ${_spPageContextInfo.userId})`,
					expand: 'ProjectLeaders, ProjectMembers'
				};

				self.site.ListItems(listName).query(settings).then((results) => {
					if (results && results.length > 0) {
						self.setState({ 
							userCanAdd: true,
							message: ''
						}, () => {
							self.getProjectClusters(projectId);
						});
					} else {
						self.setState({
							message: 'You don\'t have permissions to select a cast to this project.' 
						});
					}	
				});
			}
		} 
	}

	getProjectClusters(projectId) {
		const self = this;

		const settings = {
			select: 'Id, Title, ProjectClusters',
			filter: `Id eq ${projectId}`
		};

		(new SPOC.SP.Site()).ListItems(PROJECTLIST).query(settings).then((results) => {
			if (results && results.length > 0) {
				const clusters = [];
				const cluster = results[0].ProjectClusters;

				if (cluster) {
					cluster.results.forEach((item) => {
						clusters.push({ 
							key: item.WssId, 
							text: item.Label, 
							termGuid: item.TermGuid 
						});
					});
				}

				self.setState({ 
					clusters, 
					selectedProject: { 
						key: projectId, 
						text: results[0].Title 
					} 
				});
			}	
		});
	}

	render() {
		let projectsContent = null;

		if (!this.projectId) {
			projectsContent = (
				<div className={Styles.content}>
					<FormDropDownField label="Select project" 
										field="Title" 
										sourceList={PROJECTLIST} 
										filter={"ProjectStatus eq 'Current'"}
										onChanged={this.handleProjectsChange} 
										order="Title asc" />
				</div>
			);
		}

		let clustersContent = null;

		if (Object.keys(this.state.selectedProject).length > 0) {
			clustersContent = (
				<div className={Styles.content}>
					{
						this.state.clusters && this.state.clusters.length > 0 ? 
						(
							<FormDropDownField label="Select cluster" 
												field="ProjectClusters" 
												values={this.state.clusters}
												onChanged={this.handleClustersChange} />
						)
						: null
					}
				</div>
			);
		}

		let addToProjectContent = null;

		addToProjectContent = Object.keys(this.state.selectedCluster).length > 0 ? 
		(
			<div className={Styles.add}>
				<Button className={Styles.button}
						value="Add to a project"
						onClick={this.handleAddToProject} />
			</div>
		) 
		:
		(
			<div className={Styles.nopermissionss}>
				{this.state.message}
			</div>
		); 

		return (
			<ReactModal isOpen={this.state.showModal}
						contentLabel="Modal"
						onRequestClose={this.handleCloseModal}
						shouldCloseOnOverlayClick={false}
						className={Styles.modal}>
				<div className={`${Styles.modal_container}`}>
					<div className={Styles.header}>
						{this.props.title}
					</div>
					{projectsContent}
					{clustersContent}
					{addToProjectContent}
				</div>
				<div className={Styles.close} onClick={this.handleCloseModal}>
					<i className="ms-Icon ms-Icon--ErrorBadge" aria-hidden="true" />
				</div>
			</ReactModal>
		);
	}
}

export default ModalDialog;