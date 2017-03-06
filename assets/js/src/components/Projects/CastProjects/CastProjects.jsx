/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import ModalDialog from '../../Partials/ModalDialog/ModalDialog';
import Button from '../../Partials/Button/Button';
import { PROJECTLIST, PROJECTSHORTLIST, PROJECTSELECTIONSLIST, VIEWPROJECT } from '../../../utils/settings';

/* CSS styles */
import Styles from './CastProjects.scss';

class CastProjects extends React.Component {
	static propTypes = {
		castId: React.PropTypes.string.isRequired,
		castName: React.PropTypes.string,
		listName: React.PropTypes.string
	};

	static defaultProps = {	
		listName: PROJECTLIST		
	};	

	constructor() {
		super();
		this.state = {
			data: [],
			title: 'Projects',
			showModal: false,
			addedToProject: false,
			shortlistedToProject: {},
			selectedToProject: {},
			selectedProject: {}
		};
		this.site = new SPOC.SP.Site();
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleAddToProject = this.handleAddToProject.bind(this);
	}

	componentDidMount() {
		this.getItems();
	}

	getItems() {
		const self = this;
		const promises = [];           

		promises.push(self.getProjectItem(PROJECTSHORTLIST, 'shortlistedToProject'));
		promises.push(self.getProjectItem(PROJECTSELECTIONSLIST, 'selectedToProject'));  

		$.when(...promises).then(self.setCurrentProject.bind(null, self));
	}

	getProjectItem(listName, projectType) {
		const self = this;

		const dfd = $.Deferred(() => { 
			const settings = {
				select: 'ProjectId/Id, ProjectId/Title, CastId/Id, ProjectId/StatusText',
				expand: 'ProjectId, CastId',
				filter: `CastId/Id eq ${self.props.castId} and ProjectId/StatusText eq 'Current'`
			};

			self.site.ListItems(listName).query(settings).then((results) => {
				if (results && results.length > 0) {
					const project = {
						key: results[0].ProjectId.Id,
						text: results[0].ProjectId.Title || 'No project name'
					};

					self.setState({ [projectType]: project });
				}

				dfd.resolve();
			});
		});

		return dfd.promise();  
	}

	setCurrentProject(self, data) {
		let selectedProject = {};
		let title = '';

		if (Object.keys(self.state.shortlistedToProject).length > 0) {
			selectedProject = self.state.shortlistedToProject;
			title = 'Shortlisted Projects';
		} else if (Object.keys(self.state.selectedToProject).length > 0) {
			selectedProject = self.state.selectedToProject;
			title = 'Selected Projects';
		}

		self.setState({ 
			title,
			selectedProject,
			addedToProject: Object.keys(selectedProject).length > 0
		});
	}

	handleOpenModal() {
		this.setState({ showModal: true });
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	handleAddToProject(selectedProject) {
		this.setState({ 
			showModal: false, 
			addedToProject: true, 
			title: 'Shortlisted Projects', 
			selectedProject 
		});
	}

	render() {
		const mainContent = this.state.addedToProject && this.state.selectedProject && Object.keys(this.state.selectedProject).length > 0 ? 
		(
			<Button className={`${Styles.button} ${Styles.link_button} ms-Grid-col ms-u-md2 ms-u-sm12`}
					value={this.state.selectedProject.text}
					href={`${_spPageContextInfo.webServerRelativeUrl}${VIEWPROJECT}?pid=${this.state.selectedProject.key}`} />
		) 
		: 
		( 
			<div>
				<Button className={`${Styles.button} ms-Grid-col ms-u-md2 ms-u-sm12`}
						value="Add to a project"
						onClick={this.handleOpenModal} />
				<ModalDialog onAddToProject={this.handleAddToProject} 
								onCloseModal={this.handleCloseModal} 
								showModal={this.state.showModal}
								castId={this.props.castId}
								title={`Add ${this.props.castName} to a project`} />
			</div>				
		);
		
		return (
			<div>
				<div className={`${Styles.container} ms-Grid`}>
					<div className={`${Styles.header} ms-Grid-row`}>
						<h1>{this.state.title}</h1>
					</div>
					<div className={`${Styles.projects} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-md5 ms-u-sm12" />
						{mainContent}
						<div className="ms-Grid-col ms-u-md5 ms-u-sm12" />
					</div>
				</div>
			</div>
		);
	}
}

export default CastProjects;
