/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import Button from '../../components/Partials/Button/Button';
import { GetAssetsPath, IfArrayContainsObject, EqualObjects } from '../../utils/utils';
import { IMGPATH } from '../../utils/settings';

/* CSS styles */
import Styles from './PortfolioUpload.scss';

class PortfolioUpload extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string.isRequired,
		onUploadChange: React.PropTypes.func,
		item: React.PropTypes.objectOf(React.PropTypes.any)
	};

	constructor() {
		super();
		this.state = {	
			content: null,
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
	}

	componentDidMount() {
		this.setValue(this.props.item);
	}

	componentWillReceiveProps(nextProps) {       
		this.setValue(nextProps.item);
	}

	setValue(item) {
		if (item) {
			if (!EqualObjects(item, this.state.item, 'PortfolioItemOne') && 
				item.PortfolioItemOne && item.PortfolioItemOne.Description && item.PortfolioItemOne.Url) {
				this.getFiles(this.state.data, item.PortfolioItemOne.Description, 
					item.PortfolioItemOne.Url, null, 'PortfolioItemOne');
			}

			if (!EqualObjects(item, this.state.item, 'PortfolioItemTwo') && 
				item.PortfolioItemTwo && item.PortfolioItemTwo.Description && item.PortfolioItemTwo.Url) {
				this.getFiles(this.state.data, item.PortfolioItemTwo.Description, 
					item.PortfolioItemTwo.Url, null, 'PortfolioItemTwo');
			}

			if (!EqualObjects(item, this.state.item, 'PortfolioItemThree') && 
				item.PortfolioItemThree && item.PortfolioItemThree.Description && item.PortfolioItemThree.Url) {
				this.getFiles(this.state.data, item.PortfolioItemThree.Description, 
					item.PortfolioItemThree.Url, null, 'PortfolioItemThree');
			}

			if (!EqualObjects(item, this.state.item, 'PortfolioItemFour') && 
				item.PortfolioItemFour && item.PortfolioItemFour.Description && item.PortfolioItemFour.Url) {
				this.getFiles(this.state.data, item.PortfolioItemFour.Description, 
					item.PortfolioItemFour.Url, null, 'PortfolioItemFour');
			}

			if (!EqualObjects(item, this.state.item, 'PortfolioItemFive') && 
				item.PortfolioItemFive && item.PortfolioItemFive.Description && item.PortfolioItemFive.Url) {
				this.getFiles(this.state.data, item.PortfolioItemFive.Description, 
					item.PortfolioItemFive.Url, null, 'PortfolioItemFive');
			}

			this.setState({ item });
		}
	}

	getFiles(files, fileName, filePath, fileId, fieldName) {
		const file = { 
			id: fileId || files.length + 1, 
			path: filePath, 
			name: fileName,
			field: fieldName || this.getFieldName(files)
		};

		files.push(file);

		this.setState({ data: files }, () => {
			const content = this.getContent(files);
			const displayUploadArea = files.length > 4 ? 'none' : 'block';

			this.setState({ submitting: false, pathInput: '', content, displayUploadArea }, () => {
				this.props.onUploadChange(file);
			});
		});
	}

	getContent(data) {
		const self = this;

		const content = data && data.length > 0 ? data.map((item, i) => 
			<div className={`${Styles.file_content} ms-Grid-row`} key={i}>
				<div className={`${Styles.file_area} ms-Grid-col`}>										
					<div className={Styles.file}>
						<a href={item.path}>
							{item.name}
						</a>
					</div>
					<div id={`file_${item.id}`} className={Styles.remove} 
							onClick={self.handleRemoveButton}>
						<i className="ms-Icon ms-Icon--Clear" aria-hidden="true" />
						remove
					</div>
				</div>
			</div>
		) : null;

		return content;
	}

	getFieldName(files) {
		const index = ['PortfolioItemOne', 'PortfolioItemTwo', 'PortfolioItemThree', 'PortfolioItemFour', 'PortfolioItemFive'];

		for (let i = 0; i < index.length; i++) {
			if (IfArrayContainsObject(files, 'field', index[i]) === -1) {
				return index[i];
			}
		}

		return '';
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
				const filePath = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${self.props.listName}/${fileName}`);

				const caml = new CamlBuilder()
								.View(['ID', 'FileRef', 'LinkFilename'])
								.Query()
								.Where()
								.ComputedField('LinkFilename')
								.EqualTo(fileName)
								.ToString();

				self.site.ListItems(self.props.listName).queryCSOM(caml).then((results) => {
					if (results && results.length > 0) {
						const fileId = results[0].ID;
						const files = self.state.data;

						if (IfArrayContainsObject(files, 'id', fileId) === -1) {
							self.getFiles(files, fileName, filePath, fileId);
						} else {
							self.setState({ submitting: false, pathInput: '' });
						}
					}                      
				});  
			});   
		} 
	}

	handleRemoveButton(e) {
		const self = this;
		const id = parseInt(e.target.id.split('_')[1], 10);
		
		if (self.props.item) {
			const files = self.state.data;
			const index = IfArrayContainsObject(files, 'id', id);

			if (index > -1) {
				const file = files[index];
				file.path = '';
				file.name = '';
				
				files.splice(index, 1);

				self.setState({ data: files }, () => {
					const content = self.getContent(files);

					self.setState({ content, pathInput: '', displayUploadArea: 'block' }, () => {
						self.props.onUploadChange(file);
					});
				});  
			}  
		} else {
			self.site.ListItems(self.props.listName).delete(id).then(() => {
				const files = self.state.data;
				const index = IfArrayContainsObject(files, 'id', id);

				if (index > -1) {
					const file = files[index];
					file.path = '';
					file.name = '';
					
					files.splice(index, 1);

					self.setState({ data: files }, () => {
						const content = self.getContent(files);

						self.setState({ content, pathInput: '', displayUploadArea: 'block' }, () => {
							self.props.onUploadChange(file);
						});
					});  
				}
			});
		}
	}

	render() {
		const self = this;
		const mainContent = (self.state.submitting ? 
		(
			<div className="ms-Grid-row">
				<div className={`${Styles.submitting} ms-Grid-col ms-u-sm12`}>
					<img src={`${GetAssetsPath() + IMGPATH}/loader.gif`} 
							role="presentation" />
				</div>
			</div>
		)
		:
		(
			<div>
				<div className={`${Styles.upload_area} ms-Grid-row`} 
						style={{ display: self.state.displayUploadArea }}>
					<div className="ms-Grid-col ms-u-md9 ms-u-sm8">
						<input className={Styles.path_input} ref={(c) => { self.pathInput = c; }} disabled="disabled"
									value={self.state.pathInput} style={{ color: self.state.pathInputColor }} />
					</div>
					<div className="ms-Grid-col ms-u-md3 ms-u-sm4">
						<div className={Styles.upload_file}>
							<Button value="Upload" className={Styles.upload_button} />
							<input className={Styles.upload_input} ref={(c) => { self.uploadInput = c; }} type="file" 
										onChange={self.handleUploadChange} />
						</div>  
					</div>
				</div>
				{self.state.content}
			</div>
		));

		return (
			<div className={`${Styles.container} ms-Grid`}>
				<div className={`${Styles.header} ms-Grid-row`}>
					<h1>Portfolio</h1>
				</div>
				{mainContent}
			</div>
		);
	}
}

export default PortfolioUpload;
