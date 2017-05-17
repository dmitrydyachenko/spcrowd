/* External libraries */
import $ from 'jquery';
import React from 'react';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

/* Components */
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { ToDataUrl, MakeBlob } from '../../../utils/utils';
import SettingsView from '../SettingsView/SettingsView';
import PivotView from '../PivotView/PivotView';

/* CSS styles */
import Styles from './ExcelView.scss';

class ExcelView extends React.Component {
	static propTypes = {
		excel: React.PropTypes.objectOf(React.PropTypes.any),
		xml: React.PropTypes.objectOf(React.PropTypes.any),
		source: React.PropTypes.objectOf(React.PropTypes.any),
		loadingMessage: React.PropTypes.string,
		xmlFileNames: React.PropTypes.objectOf(React.PropTypes.string),
		onDrop: React.PropTypes.func,
		site: React.PropTypes.objectOf(React.PropTypes.any),
		listName: React.PropTypes.string
	};

	constructor(props) {
		super(props);

		this.zip = new JSZip();

		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnExcelClick = this.handleOnExcelClick.bind(this);
		this.handleOnDownloadAllClick = this.handleOnDownloadAllClick.bind(this);
	}

	handleOnExcelClick() {
		this.dropzone.open();
	}

	handleOnDrop(files) {
		if (this.props.onDrop) {
			this.props.onDrop(files);	
		}
	}

	handleOnDownloadAllClick() {
		const self = this;
		const promises = [];           

		promises.push(self.zipFile('lists', 'Lists'));
		promises.push(self.zipFile('fields', 'Fields'));
		promises.push(self.zipFile('contentTypes', 'ContentTypes'));
		promises.push(self.zipFile('groups', 'Groups'));

		$.when(...promises).then(self.downloadZippedFile.bind(null, self));
	}

	zipFile(fileName, folderName) {
		const self = this;

		const dfd = $.Deferred(() => { 
			const _fileName = self.props.xmlFileNames[fileName];

			ToDataUrl(`${_spPageContextInfo.webServerRelativeUrl}/${self.props.listName}/${_fileName}`, (base64) => {
				const folder = self.zip.folder(folderName);
				folder.file(_fileName, MakeBlob(base64), { base64: true });
				
				dfd.resolve();      
			});
		});

		return dfd.promise(); 
	}

	downloadZippedFile(self, data) {
		self.zip.generateAsync({ type: 'blob' }).then((content) => {
			FileSaver.saveAs(content, 'Content.zip');
		});
	}

	render() {
		const self = this;

		const mainContent = (
			<div className="ms-Grid">
				<div className="ms-Grid-row">
					<div className={`${Styles.dropzone} ms-Grid-col ms-u-sm12`}>	
						<Dropzone className={Styles.dropzone_container} ref={(d) => { self.dropzone = d; }} onDrop={self.handleOnDrop}>
							<div className={Styles.dropzone_title}>
								Try dropping some files here, or click to select files to upload.
							</div>
						</Dropzone>
						<div className={`${Styles.dropzone_buttons} ms-Grid-row`}>
							<div className="ms-Grid-col ms-u-sm6">	
								<div className="button" onClick={self.handleOnExcelClick}>
									Open Dropzone
								</div>
							</div>
							<div className="ms-Grid-col ms-u-sm6">	
								<SettingsView site={self.props.site} />
							</div>
						</div>
						{
							self.props.source.files.length > 0 ? 
							(
								<div className={Styles.dropzone_files}>
									{
										self.props.excel.loading ? 
										(
											<div className={Styles.loading}>
												<Spinner type={SpinnerType.large} label="Uploading..." />
											</div>
										) 
										: 
										(
											self.props.xml.loading ? 
											(
												<div className={Styles.loading}>
													<Spinner type={SpinnerType.large} 
																label={`${self.props.loadingMessage} are being processed...`} />
												</div>
											) 
											:
											(
												<div className={Styles.dropzone_files_list}>
													{
														self.props.source.files.map((file, i) => 
															(
																<div className={Styles.dropzone_files_title} key={i}>
																	{file.name}
																</div>
															)
														)
													}
												</div>
											) 
										)
									}
								</div>
							) : null
						}
						{
							self.props.source.files.length > 0 && !self.props.excel.loading && !self.props.xml.loading ? 
							(
								<div className={`${Styles.download_all} ms-Grid-row`}>
									<div className="ms-Grid-col ms-u-sm12">	
										<div className="button" onClick={self.handleOnDownloadAllClick}>
											Download all XMLs
										</div>
									</div>
								</div>
							) : null
						}
					</div>
				</div>
				<div className={`${Styles.content_row} ms-Grid-row`}>
					<PivotView excel={self.props.excel} xmlFileNames={self.props.xmlFileNames} listName={self.props.listName} />
				</div>
			</div>
		);

		return (
			<div className={Styles.container}>
				<p className="header">
					Excel tables
				</p>
				<div className={Styles.content}>
					{mainContent}
				</div>
			</div>
		);
	}
}

export default ExcelView;