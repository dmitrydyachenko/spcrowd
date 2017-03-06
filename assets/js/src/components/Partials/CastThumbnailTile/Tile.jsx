/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import ModalDialog from '../../Partials/ModalDialog/ModalDialog';
import { VIEWCASTBIOPAGE, IMGPATH, PROJECTSHORTLIST, PROJECTSELECTIONSLIST } from '../../../utils/settings';
import { GetAssetsPath } from '../../../utils/utils';

/* CSS styles */
import Styles from './Tile.scss';

class Tile extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string,
		item: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number,
			React.PropTypes.object
		]),
		expandedField: React.PropTypes.string,
		showOverlayPanel: React.PropTypes.bool,
		noGridColumn: React.PropTypes.bool,
		onFetchData: React.PropTypes.func,
		parentComponentTitle: React.PropTypes.string,
		userCanAdd: React.PropTypes.bool
	};

	constructor(props) {
		super(props);
		this.state = {
			overlayPanel: '',
			showModal: false, 
			addedToProject: null,
			option: 'submitting',
			profilePhoto: null,
			submitting: false
		};
		this._isMounted = false;
		this.site = new SPOC.SP.Site();
		this.castId = null;
		this.castName = null;
		this.projectId = SPOC.Utils.Url.getQueryString('pid');
		this.handleOnClick = this.handleOnClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleAddToProject = this.handleAddToProject.bind(this);
		this.handleOnRemoveFromProjectShortlist = this.handleOnRemoveFromProjectShortlist.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		this.init(this.props);
	}

	componentWillReceiveProps(nextProps) {      
		this.init(nextProps);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleOnClick() {
		if (this.state.option === 'addToProject') {
			this.setState({ showModal: true });
		} else if (this.state.option === 'shortlistedToProject') {
			this.addToProject(PROJECTSELECTIONSLIST, PROJECTSHORTLIST);
		} else if (this.state.option === 'selectedToProject') {
			this.addToProject(PROJECTSHORTLIST, PROJECTSELECTIONSLIST);
		}
	}

	handleMouseEnter() {
		if (this.props.showOverlayPanel) {
			this.setState({ overlayPanel: Styles.slideUpIn80 }, () => {
				if (this.props.parentComponentTitle === 'Search Results' || this.props.parentComponentTitle === 'Recent Casts') {
					this.checkProjectMembership(this.castId);
				} else if (this.props.userCanAdd) {
					this.setState({ 							
						option: this.props.listName === PROJECTSHORTLIST ? 'shortlistedToProject' : 
								(this.props.listName === PROJECTSELECTIONSLIST ? 'selectedToProject' : null)
					});
				} else {
					this.setState({ option: null });
				}
			});
		}
	}
	
	handleMouseLeave() {
		if (this.props.showOverlayPanel) {
			this.setState({ overlayPanel: '' });
		}
	}

	handleCloseModal() {
		this.setState({ showModal: false });
	}

	handleAddToProject(selectedProject) {
		this.setState({ showModal: false }, () => {
			if (this.props.onFetchData) {
				this.props.onFetchData();
			}
		});
	}

	handleOnRemoveFromProjectShortlist() {
		const self = this;

		self.setState({ submitting: true });

		const idToDelete = self.props.item.Id;

		self.site.ListItems(PROJECTSHORTLIST).delete(idToDelete).then(() => { 
			self.setState({ submitting: false, addedToProject: null }, () => {
				if (self.props.onFetchData) {
					self.props.onFetchData();
				}
			});
		});
	}

	init(props) {
		if (props.item) {
			this.castId = (props.expandedField && props.item[props.expandedField] && props.item[props.expandedField].Id ? 
				props.item[props.expandedField].Id : (props.item.Id || null));

			this.castName = props.item.CastName || 
				(props.expandedField && props.item[props.expandedField] && props.item[props.expandedField].CastName ? 
					props.item[props.expandedField].CastName : null);

			const profilePhoto = props.item.ProfilePhoto || 
				(props.expandedField && props.item[props.expandedField] && props.item[props.expandedField].ProfilePhoto ? 
					props.item[props.expandedField].ProfilePhoto : null);

			this.setState({ profilePhoto });
		}
	}

	addToProject(targetList, sourceList) {
		const self = this;	

		self.setState({ 
			addedToProject: { id: self.props.item.Id, cluster: self.props.item.ProjectClusters }
		}, () => {
			if (self.state.addedToProject) {
				self.setState({ submitting: true });

				$.ajax({
					url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getbytitle('${targetList}')/Fields/GetByTitle('ProjectClusters_0')/InternalName`,
					type: 'GET',
					contentType: 'application/json;odata=verbose',
					headers: {
						Accept: 'application/json;odata=verbose'
					},
					success: (data) => {
						const internalName = (data && data.d && data.d.InternalName ? data.d.InternalName : null);

						if (internalName) {
							const cluster = self.state.addedToProject.cluster;

							if (cluster) {						
								const settings = {
									ProjectIdId: self.projectId,
									CastIdId: self.castId,
									[internalName]: `${cluster.WssId};#${cluster.Label}|${cluster.TermGuid}`
								};

								self.site.ListItems(targetList).create(settings).then(() => { 
									const idToDelete = self.state.addedToProject.id;

									self.site.ListItems(sourceList).delete(idToDelete).then(() => { 
										self.setState({ submitting: false });

										if (self.props.onFetchData) {
											self.props.onFetchData();
										}
									});
								});
							}
						}                            
					}
				}); 
			}
		});
	}

	checkProjectMembership(castId) {
		if (castId) {
			const self = this;

			self.setState({ submitting: true }, () => {
				if (self.projectId && !self.props.userCanAdd) {
					self.setState({ 
						option: null,
						submitting: false
					});
				} else {
					const settings = {
						select: 'Id, ProjectId/Id, ProjectId/Title, ProjectId/StatusText, CastId/Id, ProjectClusters',
						expand: 'ProjectId, CastId',
						filter: `CastId/Id eq ${castId} and ProjectId/StatusText eq 'Current'`
					};

					self.site.ListItems(PROJECTSHORTLIST).query(settings).then((firstResults) => {
						if (firstResults && firstResults.length > 0 && self._isMounted) {
							self.setState({ 
								option: null,
								submitting: false
							});
						} else {
							self.site.ListItems(PROJECTSELECTIONSLIST).query(settings).then((secondResults) => {
								if (secondResults && secondResults.length > 0 && self._isMounted) {
									self.setState({ 
										option: null,
										submitting: false
									});
								} else {
									self.setState({ 
										option: 'addToProject',
										submitting: false
									});
								}
							});
						}
					});
				}
			});
		} 
	}

	render() {
		let showOptions = `${Styles.option} ${this.state.overlayPanel} `;
		showOptions += !this.state.overlayPanel ? 'hidden' : 'visible';

		const castName = this.castName ?
		(
			<div className={Styles.name_container}>
				<div className={Styles.name}>{this.castName}</div>
			</div>
		) 
		: null;

		const profilePhoto = this.state.profilePhoto ?
		(
			<img src={`${this.state.profilePhoto}?RenditionID=5`} alt="" />
		) 
		: 
		(
			<img src={`${GetAssetsPath() + IMGPATH}/model.jpeg?RenditionID=5`} alt="" />
		);

		const option = this.state.option === 'submitting' ? 
		(
			<img src={`${GetAssetsPath() + IMGPATH}/loading.svg`}
					className={Styles.submitting} 
					role="presentation" />
		)
		:
		this.state.option === 'addToProject' ? 
		(
			this.state.submitting ?
			(
				<img src={`${GetAssetsPath() + IMGPATH}/loading.svg`}
						className={Styles.submitting} 
						role="presentation" />
			)
			:
			(
				<i id={this.state.option} 
					className="fa fa-plus-circle" 
					aria-hidden="true" 
					onClick={this.handleOnClick}>
					<p>Add</p>
					<ModalDialog onAddToProject={this.handleAddToProject} 
									onCloseModal={this.handleCloseModal} 
									showModal={this.state.showModal}
									castId={this.castId ? this.castId.toString() : null}
									title={`Add ${this.castName} to ${this.props.parentComponentTitle === 'Search Results' || 
											this.props.parentComponentTitle === 'Recent Casts' ? 'a' : 'this'} project`} />
				</i>
			)
		)
		:
		this.state.option === 'shortlistedToProject' ? 
		(
			this.state.submitting ?
			(
				<img src={`${GetAssetsPath() + IMGPATH}/loading.svg`}
						className={Styles.submitting} 
						role="presentation" />
			)
			:
			(
				<i id={this.state.option} 
					className={`${Styles.shortlisted} fa fa-plus-circle`}
					aria-hidden="true" 
					onClick={this.handleOnClick}>
					<p>Add to selected</p>
				</i>
			)
		)
		:
		this.state.option === 'selectedToProject' ? 
		(
			this.state.submitting ?
			(
				<img src={`${GetAssetsPath() + IMGPATH}/loading.svg`}
						className={Styles.submitting} 
						role="presentation" />
			)
			:
			(
				<i id={this.state.option} 
					className={`${Styles.selected} fa fa-minus-circle`}
					aria-hidden="true" 
					onClick={this.handleOnClick}>
					<p>Move to shortlist</p>
				</i>
			)
		)
		: null;

		const removeContent = this.state.option === 'shortlistedToProject' ? 
		(
			<div className={Styles.remove} onClick={this.handleOnRemoveFromProjectShortlist}>
				<i className="ms-Icon ms-Icon--ErrorBadge" aria-hidden="true" />
			</div>
		)
		: null;

		return (
			<div className={Styles.container}>
				<div className={(!this.props.noGridColumn ? 'ms-Grid-col ms-u-lg3 ms-u-md4 ms-u-sm12 ' : '') + Styles.tile_area}
						onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
					<div className={Styles.tile}>
						{profilePhoto}
						{castName}
						<div className={showOptions}>
							<div className={Styles.overlay}>
								{option}
								<a href={`${_spPageContextInfo.webServerRelativeUrl}${VIEWCASTBIOPAGE}?cid=${this.castId}`}>
									<i className="fa fa-eye" aria-hidden="true">
										<p>View</p>
									</i>
								</a>
							</div>
							{removeContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Tile;