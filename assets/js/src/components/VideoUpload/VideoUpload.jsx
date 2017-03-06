/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import Button from '../../components/Partials/Button/Button';
import { GetAssetsPath } from '../../utils/utils';
import { IMGPATH } from '../../utils/settings';

/* CSS styles */
import Styles from './VideoUpload.scss';

class VideoUpload extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string.isRequired,
		onUploadChange: React.PropTypes.func,
		item: React.PropTypes.objectOf(React.PropTypes.any)
	};

	constructor() {
		super();
		this.state = {	
			filePath: '',
			submitting: false,
			pathInputColor: '#898989',
			pathInput: '',
			data: [],
			displayUploadArea: 'block',
			item: null
		};
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleRemoveButton = this.handleRemoveButton.bind(this);
		this.site = new SPOC.SP.Site();
		this.fileId = 0;
	}

	componentDidMount() {
		this.setValue(this.props.item);
	}

	componentWillReceiveProps(nextProps) {        
		this.setValue(nextProps.item);
	}

	setValue(item) {
		if (item) {
			this.setState({ item }, () => {
				if (this.state.item && this.state.item.EmbedVideo && this.state.item.EmbedVideo.Url) {
					this.setState({ filePath: this.state.item.EmbedVideo.Url }, () => {
						this.videoElement.load();
					});
				}
			});
		}
	}

	handleUploadChange() {
		const self = this;
		const uploadInput = self.uploadInput;    

		if (uploadInput && uploadInput.value) {
			self.setState({ submitting: true, pathInputColor: '#898989', pathInput: uploadInput.value }, () => {
				const parts = uploadInput.value.split('\\');
				const fileName = parts[parts.length - 1];                     
				const library = self.site.Files(self.props.listName);

				library.upload(uploadInput).then(() => {  
					const filePath = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${self.props.listName}/${fileName}`);

					self.setState({ filePath }, () => {
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

								self.setState({
									submitting: false
								}, () => {
									self.props.onUploadChange({ path: filePath, name: fileName, field: 'EmbedVideo' });
								});
							}                   
						}); 
					});
				});
			});
		} 
	}

	handleRemoveButton() {
		const self = this;

		if (self.props.item) {
			self.fileId = 0;

			self.setState({ filePath: '', pathInput: '' }, () => {
				self.props.onUploadChange({ path: '', name: '', field: 'EmbedVideo' });
			});
		} else {
			self.site.ListItems(self.props.listName).delete(self.fileId).then(() => {
				self.fileId = 0;

				self.setState({ filePath: '', pathInput: '' }, () => {
					self.props.onUploadChange({ path: '', name: '', field: 'EmbedVideo' });
				});
			});  
		}
	}

	render() {
		const self = this;

		let videoContent = null;

		if (self.state.filePath) {
			videoContent = (
				<div className={`${Styles.file_content} ms-Grid-row`}>
					<div className={`${Styles.file_area} ms-Grid-col`}>										
						<div className={`${Styles.file} ms-Grid-col ms-u-sm12`}>
							<video src={self.state.filePath} controls ref={(c) => { self.videoElement = c; }} />
						</div>
						<div className={Styles.remove} onClick={self.handleRemoveButton}>
							<i className="ms-Icon ms-Icon--ErrorBadge" aria-hidden="true" />
						</div>
					</div>
				</div>
			);
		}

		const content = videoContent || (
			<div className={`${Styles.upload_area} ms-Grid-row`} 
					style={{ display: self.state.displayUploadArea }}>
				<div className="ms-Grid-col ms-u-sm8">
					<input className={Styles.path_input} ref={(c) => { self.pathInput = c; }} disabled="disabled"
								value={self.state.pathInput} style={{ color: self.state.pathInputColor }} />
				</div>
				<div className="ms-Grid-col ms-u-sm4">
					<div className={Styles.upload_file}>
						<Button value="Upload" className={Styles.upload_button} />
						<input className={Styles.upload_input} ref={(c) => { self.uploadInput = c; }} 
									type="file" onChange={self.handleUploadChange} />
					</div>  
				</div>
			</div>
		);

		const mainContent = (self.state.submitting ? 
		(
			<div className="ms-Grid-row">
				<div className={`${Styles.submitting} ms-Grid-col ms-u-sm12`}>
					<img src={`${GetAssetsPath() + IMGPATH}/loader.gif`} role="presentation" />
				</div>
			</div>
		)
		:
		(
			<div>
				{content}
			</div>
		));

		return (
			<div className={`${Styles.container} ms-Grid`}>
				<div className={`${Styles.header} ms-Grid-row`}>
					<h1>Video</h1>
				</div>
				{mainContent}
			</div>
		);
	}
}

export default VideoUpload;
