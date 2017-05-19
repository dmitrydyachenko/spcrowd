import $ from 'jquery';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { ToDataUrl, MakeBlob } from '../../../utils/utils';

import ExcelView from './ExcelView';

export default class ExcelViewContainer extends Component {
	constructor(props) {
		super(props);

		this.zip = new JSZip();

		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnDownloadAllClick = this.handleOnDownloadAllClick.bind(this);
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
			const url = `${_spPageContextInfo.webServerRelativeUrl}/${self.props.listName}/${_fileName}`;

			ToDataUrl(url, (base64) => {
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
		const {
			excel,
			xml,
			source,
			xmlFileNames,
			site,
			loadingMessage,
			listName,
			setListName
		} = this.props;

		return (
			<ExcelView 
				excel={excel}
				xml={xml}
				source={source}
				xmlFileNames={xmlFileNames}
				site={site}
				loadingMessage={loadingMessage}
				listName={listName}
				onDrop={files => this.handleOnDrop(files)}
				onDownloadAllClick={() => this.handleOnDownloadAllClick()}
				setListName={setListName} />
		);
	}
}

ExcelViewContainer.propTypes = {
	excel: PropTypes.objectOf(PropTypes.any),
	xml: PropTypes.objectOf(PropTypes.any),
	source: PropTypes.objectOf(PropTypes.any),	
	xmlFileNames: PropTypes.objectOf(PropTypes.string),
	site: React.PropTypes.objectOf(PropTypes.any),
	loadingMessage: PropTypes.string,
	listName: PropTypes.string,
	onDrop: PropTypes.func,
	setListName: PropTypes.func
};