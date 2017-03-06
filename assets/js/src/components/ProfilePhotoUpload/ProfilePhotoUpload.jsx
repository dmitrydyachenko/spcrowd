/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import Button from '../../components/Partials/Button/Button';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
import { GetAssetsPath } from '../../utils/utils';
import { IMGPATH } from '../../utils/settings';

/* CSS styles */
import Styles from './ProfilePhotoUpload.scss';

class ProfilePhotoUpload extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string.isRequired,
		onUploadChange: React.PropTypes.func,
		data: React.PropTypes.arrayOf(React.PropTypes.object),
		profilePhotoButtonTitle: React.PropTypes.string
	};

	constructor() {
		super();
		this.state = {	
			content: null,
			submitting: false,
			pathInputColor: '#898989',
			pathInput: '',
			data: []
		};
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleHideProfilePhotoClick = this.handleHideProfilePhotoClick.bind(this);
		this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
		this.site = new SPOC.SP.Site();
		this.filePath = '';
		this.fileId = 0;
	}

	componentDidMount() {
		this.getItems(this.props.data);
	}

	componentWillReceiveProps(nextProps) {        
		this.getItems(nextProps.data);
	}

	getItems(data) {
		if (data) {
			this.setState({ data }, () => {
				this.setState({
					content: (
						<div className={`${Styles.profile_photo} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm12">
								<ProfilePhoto data={this.state.data} 
												buttonTitle={this.props.profilePhotoButtonTitle}
												onButtonClick={this.handleHideProfilePhotoClick} />
							</div>
						</div>
					)
				});

				if (data[0] && data[0].ProfilePhoto) {
					this.props.onUploadChange({ value: data[0].ProfilePhoto, field: 'ProfilePhoto' }, true);
				}
			});
		}
	}

	uploadFile(uploadInput) {
		const self = this;

		if (uploadInput && uploadInput.value) {
			self.setState({ submitting: true, pathInputColor: '#898989', pathInput: uploadInput.value });

			const parts = uploadInput.value.split('\\');
			const fileName = parts[parts.length - 1];                     
			const library = self.site.Files(self.props.listName);

			library.upload(uploadInput).then(() => {  
				self.filePath = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${self.props.listName}/${fileName}`);

				const caml = new CamlBuilder()
								.View(['ID', 'FileRef', 'LinkFilename'])
								.Query()
								.Where()
								.ComputedField('LinkFilename')
								.EqualTo(fileName)
								.ToString();

				self.site.ListItems(self.props.listName).queryCSOM(caml).then((results) => {
					if (results && results.length > 0) {
						self.fileId = results[0].ID;

						const data = self.state.data;

						const content = data && data.length > 0 ?  
						(
							<div className={`${Styles.profile_photo} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm12">
									<ProfilePhoto data={[{ ProfilePhoto: `${self.filePath}` }]} 
													buttonTitle={self.props.profilePhotoButtonTitle}
													onButtonClick={self.handleHideProfilePhotoClick} />
								</div>
							</div>
						) 
						:
						(
							<div className={`${Styles.file_content} ms-Grid-row`}>
								<div className={`${Styles.file_area} ms-Grid-col`}>										
									<img src={`${self.filePath}?RenditionID=5`}
											className={Styles.file} role="presentation" />
									<div className={Styles.remove} onClick={self.handleRemoveButtonClick}>
										<i className="ms-Icon ms-Icon--ErrorBadge" aria-hidden="true" />
									</div>
								</div>
							</div>
						);

						self.setState({
							submitting: false, 
							content
						}, () => {							
							self.props.onUploadChange({ value: self.filePath, field: 'ProfilePhoto' }, true);
						});
					}                      
				});  
			});   
		} 
	}

	handleUploadChange() {
		this.uploadFile(this.uploadInput);
	}

	handleRemoveButtonClick() {
		const self = this;

		self.site.ListItems(self.props.listName).delete(self.fileId).then(() => {
			self.filePath = '';
			self.fileId = 0;

			self.setState({ content: null, pathInput: '' }, () => {
				self.props.onUploadChange({ value: '', field: 'ProfilePhoto' }, true);
			});
		});  
	}

	handleHideProfilePhotoClick(uploadInput) {
		this.uploadFile(uploadInput);
	}

	render() {
		const self = this;

		const imageUploadContent = self.state.content || (self.state.submitting ? 
		(
			<div className="ms-Grid-row">
				<div className="ms-Grid-col ms-u-sm12">
					<img src={`${GetAssetsPath() + IMGPATH}/loader.gif`} role="presentation" />
				</div>
			</div>
		)
		:
		(
			<div className="ms-Grid-row">
				<div className="ms-Grid-col ms-u-md3 ms-u-sm12">
					<div className={Styles.title}>
						Profile picture:
					</div>
				</div>
				<div className="ms-Grid-col ms-u-md6 ms-u-sm12">
					<input className={Styles.path_input} disabled="disabled"
								value={self.state.pathInput} style={{ color: self.state.pathInputColor }} />
				</div>
				<div className="ms-Grid-col ms-u-md3 ms-u-sm12">
					<div className={Styles.upload_file}>
						<Button value="Upload" className={Styles.upload_button} />
						<input className={Styles.upload_input} ref={(c) => { self.uploadInput = c; }} type="file" 
									onChange={self.handleUploadChange} />
					</div>  
				</div>
			</div>
		));
		
		return (
			<div className={`${Styles.container} ms-Grid`}>
				{imageUploadContent}
			</div>
		);
	}
}

export default ProfilePhotoUpload;
