/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';
import Gallery from 'react-photo-gallery';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import Button from '../../components/Partials/Button/Button';
import { GetAssetsPath, IfArrayContainsObject, GetFileNameFromUrl, EqualObjects } from '../../utils/utils';
import { IMGPATH, CASTIMAGES } from '../../utils/settings';

/* CSS styles */
import Styles from './PhotosUpload.scss';

class PhotosUpload extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string.isRequired,
		onUploadChange: React.PropTypes.func,
		item: React.PropTypes.objectOf(React.PropTypes.any)
	};

	constructor() {
		super();
		this.state = {	
			submitting: false,
			pathInputColor: '#898989',
			pathInput: '',
			displayUploadArea: 'block',
			photos: [],
			photosRowLimit: {
				mobile: 0,
				desktop: 0
			}
		};
		this.handleUploadChange = this.handleUploadChange.bind(this);
		this.handleRemoveButton = this.handleRemoveButton.bind(this);		
		this.site = new SPOC.SP.Site();
	}

	componentDidMount() {
		this.setValue(this.props.item);
	}

	componentWillReceiveProps(nextProps) {        
		if (!EqualObjects(nextProps.item, this.state.item, 'PhotoOne') &&
			!EqualObjects(nextProps.item, this.state.item, 'PhotoTwo') &&
			!EqualObjects(nextProps.item, this.state.item, 'PhotoThree') &&
			!EqualObjects(nextProps.item, this.state.item, 'PhotoFour') &&
			!EqualObjects(nextProps.item, this.state.item, 'PhotoFive')) {
			this.setValue(nextProps.item);
		}
	}

	setValue(item) {
		if (item) {
			this.setState({ photos: [] }, () => {
				this.setValueForField(item.PhotoOne);
				this.setValueForField(item.PhotoTwo);
				this.setValueForField(item.PhotoThree);
				this.setValueForField(item.PhotoFour);
				this.setValueForField(item.PhotoFive);
			});
		}
	}

	setValueForField(field) {
		if (field && field.Url) {
			this.getPhotosMetadata(field.Url);
		}
	}

	getFieldName(dataLength) {
		switch (dataLength) {
			case 1:
				return 'PhotoOne';
			case 2:
				return 'PhotoTwo';
			case 3:
				return 'PhotoThree';
			case 4:
				return 'PhotoFour';
			case 5:
				return 'PhotoFive';	
			default:
				return '';
		}
	}

	getPhotosMetadata(url) {
		const self = this;
		const fileName = decodeURI(GetFileNameFromUrl(url));

		const caml = new CamlBuilder()
                    .View(['ID', 'FileRef', 'LinkFilename', 'ImageHeight', 'ImageWidth'])
                    .Query()
                    .Where()
                    .ComputedField('LinkFilename')
                    .EqualTo(fileName)
                    .ToString();

		self.site.ListItems(CASTIMAGES)
					.queryCSOM(caml)
					.then((results) => {
						if (results && results.length > 0) {
							let photos = self.state.photos;

							const width = results[0].ImageWidth / 2;
							const height = results[0].ImageHeight / 2;
							const aspectRatio = width / height;

							const photo = { 
								id: results[0].ID, 
								src: results[0].FileRef, 
								path: results[0].FileRef,
								name: fileName,
								field: self.getFieldName(photos.length + 1), 
								width,
								height, 
								aspectRatio: Math.round(aspectRatio * 100) / 100,
								lightboxImage: {
									src: results[0].FileRef
								}
							};

							photos.push(photo);
							photos = photos.sort(self.compareAspectRatio);

							const photosCount = photos.length;
							const photosRowLimit = self.state.photosRowLimit;

							if (photosCount < 4) {
								photosRowLimit.mobile = photosCount;
								photosRowLimit.desktop = photosCount;
							} else if (photosCount === 4) {
								photosRowLimit.mobile = 2;
								photosRowLimit.desktop = 2;
							} else if (photosCount === 5) {
								photosRowLimit.mobile = 3;
								photosRowLimit.desktop = 3;
							} 

							const displayUploadArea = photosCount > 4 ? 'none' : 'block';

							self.setState({ 
								submitting: false, 
								pathInput: '', 
								photos, 
								photosRowLimit, 
								displayUploadArea 
							}, () => {
								self.props.onUploadChange(photo);
							});
						}
					});
	}

	compareAspectRatio(a, b) {
		return (a.aspectRatio < b.aspectRatio ? -1 : (a.aspectRatio > b.aspectRatio ? 1 : 0));
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
						if (IfArrayContainsObject(self.state.photos, 'id', results[0].ID) === -1) {
							self.getPhotosMetadata(filePath);
						} else {
							self.setState({ submitting: false, pathInput: '' });
						}
					}                      
				});  
			});   
		} 
	}

	handleRemoveButton(id, index) {
		const self = this;

		self.site.ListItems(self.props.listName).delete(id).then(() => {
			const photos = self.state.photos;

			self.setState({ photos }, () => {
				const displayUploadArea = self.state.photos.length > 4 ? 'none' : 'block';
				self.setState({ pathInput: '', displayUploadArea });
			});  
		});
	}

	render() {
		const self = this;

		const content = self.state.photos.length > 0 ? 
		(
			<Gallery photos={self.state.photos} 
						disableLightbox={false} 
						custom={self.state.photosRowLimit}
						closeImgUrl={`${GetAssetsPath() + IMGPATH}/remove.png`}
						onRemove={this.handleRemoveButton} />
		) : null;

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
				{content}
			</div>
		));

		return (
			<div className={`${Styles.container} ms-Grid`}>
				<div className={`${Styles.header} ms-Grid-row`}>
					<h1>Photos</h1>
				</div>
				{mainContent}
			</div>
		);
	}
}

export default PhotosUpload;
