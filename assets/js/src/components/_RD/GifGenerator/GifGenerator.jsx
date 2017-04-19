/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';
import Gifshot from 'gifshot';
import Moment from 'moment';

/* Components */
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import CamlBuilder from '../../../../vendor/camljs';
import { DOCUMENTSLIBRARY } from '../../../utils/settings';

/* CSS styles */
import Styles from './GifGenerator.scss';

class GifGenerator extends React.Component {
	constructor() {
		super();

		this.state = {
			gifImage: '',
			gifImageUploaded: '',
			gifCreating: false,
			gifLoading: false,
			isSupported: true
		};

		this.gifFile = '';
		this.gifFileName = '';
		this.site = new SPOC.SP.Site();

		this.handleOnClick = this.handleOnClick.bind(this);
	}

	componentDidMount() { 
		this.init();
	}

	init() {
		this.setState({ isSupported: Gifshot.isWebCamGIFSupported() });
	}

	handleOnClick() {
		const self = this;

		self.setState({ gifCreating: true }, () => {
			Gifshot.createGIF({ 
				text: `${_spPageContextInfo.userDisplayName}`, 
				fontSize: '20px', 
				fontColor: '#FF0000',
				resizeFont: true,
				interval: 0.5
			}, 
			(obj) => {
				if (!obj.error) {
					const gifImage = obj.image;

					self.setState({ gifImage, gifCreating: false }, () => {
						Gifshot.stopVideoStreaming();		

						self.gifFileName = `Gif_${Moment()}.gif`;

						const fileCreateInfo = new SP.FileCreationInformation();
						fileCreateInfo.set_url(self.gifFileName);
						fileCreateInfo.set_content(new SP.Base64EncodedByteArray());

						const gifImageRaw = self.convertDataURIToBinary(self.state.gifImage);

						for (let i = 0; i < gifImageRaw.length; i++) {
							fileCreateInfo.get_content().append(gifImageRaw[i]);
						}

						const context = SP.ClientContext.get_current();   
						const currentWeb = context.get_web();
						const documentsLibrary = currentWeb.get_lists().getByTitle(DOCUMENTSLIBRARY);

						self.gifFile = documentsLibrary.get_rootFolder().get_files().add(fileCreateInfo);

						context.load(this.gifFile);
						context.executeQueryAsync(() => {
							self.setState({ gifLoading: true }, () => {
								const caml = new CamlBuilder()
												.View(['ID', 'FileRef', 'LinkFilename'])
												.Query()
												.Where()
												.ComputedField('LinkFilename')
												.EqualTo(self.gifFileName)
												.ToString();

								self.site.ListItems(DOCUMENTSLIBRARY).queryCSOM(caml).then((results) => {
									if (results && results.length > 0) {
										self.setState({
											gifLoading: false,
											gifImageUploaded: results[0].FileRef
										});
									}                   
								}); 
							});
						}, (sender, args) => {
							console.log(args.get_message());
						});
					});
				}
			});
		});	
	}

	convertDataURIToBinary(dataURI) {
		const BASE64_MARKER = ';base64,';
		const raw = window.atob(dataURI.substring(dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length));
		const rawLength = raw.length;
		const array = new Uint8Array(new ArrayBuffer(rawLength));

		for (let i = 0; i < rawLength; i++) {
			array[i] = raw.charCodeAt(i);
		}

		return array;
	}

	render() {
		const self = this;

		const content = (
			<div>
				<div className={`${Styles.header_row} ms-Grid-row`}>
					<div className={`${Styles.header_column} ${Styles.column} ms-Grid-col ms-u-sm6`}>
						Created GIF
					</div>	
					<div className={`${Styles.header_column} ${Styles.column} ms-Grid-col ms-u-sm6`}>
						Uploaded GIF
					</div>	
				</div>
				{
					self.state.gifImage || self.state.gifImageUploaded ? (
						<div className={`${Styles.item_row} ms-Grid-row`}>
							<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm6`}>
								{
									this.state.gifCreating ? 
									(
										<Spinner label="Creating gif..." />
									) 
									:
									(
										self.state.gifImage ? <img src={self.state.gifImage} role="presentation" /> : null
									)
								}
							</div>	
							<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm6`}>
								{
									this.state.gifLoading ? 
									(
										<Spinner label="Loading gif..." />
									) 
									:
									(
										self.state.gifImageUploaded ? <img src={self.state.gifImageUploaded} role="presentation" /> : null
									)
								}
							</div>	
						</div>
					) : null
				}
			</div>
		);

		const mainContent = (
			<div className={Styles.content}>
				<div className="ms-Grid">
					<div className={`${Styles.item_row} ms-Grid-row`}>
						<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm12`}>
							{
								self.state.isSupported ? 
								(
									<button className={Styles.gif_create_button} type="button" onClick={self.handleOnClick}>
										Create GIF
									</button>
								) 
								: 
								(
									<div className={Styles.webcam_not_supported}>
										Current browser does not support creating animated GIFs from a webcam video stream 
									</div>
								) 
							}
						</div>	
					</div>
					{content}
				</div>
			</div>
		);

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					Gif Generator
				</p>
				{mainContent}
			</div>
		);
	}
}

export default GifGenerator;