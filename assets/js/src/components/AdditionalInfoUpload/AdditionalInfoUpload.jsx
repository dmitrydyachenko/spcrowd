/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import Button from '../../components/Partials/Button/Button';
import { GetAssetsPath } from '../../utils/utils';
import { IMGPATH } from '../../utils/settings';

/* CSS styles */
import Styles from './AdditionalInfoUpload.scss';

class AdditionalInfoUpload extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string.isRequired,
		onUploadChange: React.PropTypes.func,
		item: React.PropTypes.objectOf(React.PropTypes.any),
		customPathInputClass: React.PropTypes.string
	};

	constructor() {
		super();
		this.state = {	
			content: null,
			submitting: false,
			pathInputColor: '#898989',
			pathInput: ''
		};
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleRemoveButton = this.handleRemoveButton.bind(this);
		this.site = new SPOC.SP.Site();
		this.filePath = '';
		this.fileId = 0;
	}

	componentDidMount() {
		this.setValue(this.props.item);
	}

	componentWillReceiveProps(nextProps) {        
		this.setValue(nextProps.item);
	}

	setValue(item) {
		if (item && item.AdditionalInfo && item.AdditionalInfo.Url && item.AdditionalInfo.Description) {
			this.getFile(item.AdditionalInfo.Url, item.AdditionalInfo.Description);
		}
	}

	getFile(filePath, fileName, fileId) {
		const self = this;

		if (fileId) {
			self.fileId = fileId;
		}

		self.setState({
			submitting: false, 
			content: ( 
				<div>
					<div className="ms-Grid-col ms-u-sm12">
						<div className="ms-Grid">
							<div className="ms-Grid-row">
								<div className={`${Styles.file_area} ${Styles.centered} ms-Grid-col ms-u-sm12`}>			
									<div className={Styles.file_title}>
										Additional info:
									</div>
									<div className={Styles.file}>
										<a href={filePath}>
											{fileName}
										</a>
									</div>
									<div className={Styles.remove} onClick={self.handleRemoveButton}>
										<i className="ms-Icon ms-Icon--Clear" aria-hidden="true" />
										remove
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}, () => {
			self.props.onUploadChange({ path: filePath, name: fileName, field: 'AdditionalInfo' });
		});
	}

	handleUploadChange() {
		const self = this;
		const uploadInput = self.uploadInput;    

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
						self.getFile(self.filePath, fileName, results[0].ID);
					}                      
				});  
			});   
		} 
	}

	handleRemoveButton() {
		const self = this;

		if (self.props.item) {
			self.filePath = '';
			self.fileId = 0;

			self.setState({ content: null, pathInput: '' }, () => {
				self.props.onUploadChange({ path: '', name: '', field: 'AdditionalInfo' });
			});
		} else {
			self.site.ListItems(self.props.listName).delete(self.fileId).then(() => {
				self.filePath = '';
				self.fileId = 0;

				self.setState({ content: null, pathInput: '' }, () => {
					self.props.onUploadChange({ path: '', name: '', field: 'AdditionalInfo' });
				});
			});  
		}
	}

	render() {
		const self = this;

		const mainPathInputClass = self.props.customPathInputClass || 'ms-Grid-col ms-u-md6 ms-u-sm12';

		const content = self.state.content || (
			<div>
				<div className="ms-Grid-col ms-u-sm3" />
				<div className="ms-Grid-col ms-u-sm6">
					<div className="ms-Grid">
						<div className="ms-Grid-row">
							<div className={`${Styles.file_area} ms-Grid-col ms-u-md3 ms-u-sm12`}>
								<div className={Styles.file_title}>
									Additional info:
								</div>	
							</div>
							<div className={mainPathInputClass}>
								<input className={Styles.path_input} ref={(c) => { self.pathInput = c; }} disabled="disabled"
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
					</div>
				</div>	
				<div className="ms-Grid-col ms-u-sm3" />
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
			<div className={Styles.container}>
				{mainContent}
			</div>
		);
	}
}

export default AdditionalInfoUpload;
