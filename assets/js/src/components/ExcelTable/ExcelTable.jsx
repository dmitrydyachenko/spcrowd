/* External libraries */
import $ from 'jquery';
import xlsx from 'xlsx';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import { DOCUMENTSLIBRARY } from '../../utils/settings';
import { AjaxTransport, FormatXml, MergeObjects } from '../../utils/utils';
import { GetFieldsXml } from '../Controllers/Fields/Fields';
import { GetListsXml } from '../Controllers/Lists/Lists';
import { GetContentTypesXml } from '../Controllers/ContentTypes/ContentTypes';
import ExcelTableView from './ExcelTableView';

class ExcelTable extends React.Component {
	constructor() {
		super();

		this.state = {
			excel: {
				fields: [],
				lists: [],
				contentTypes: [],
				path: '',
				loading: false
			},
			xml: {
				fields: [],
				lists: [],
				contentTypes: [],
				loading: true
			},
			source: { value: '', files: [] },
			loadingMessage: ''
		};

		this.namespaces = {
			group: 'SPCrowd',
			prefix: 'SPCrowd'
		};

		this.xmlFileNames = {
			fields: 'Fields.xml',
			lists: 'Lists.xml',
			contentTypes: 'ContentTypes.xml'
		};

		this.excelSheetNames = {
			fields: 'Fields',
			lists: 'Lists',
			contentTypes: 'ContentTypes'
		};

		this.site = new SPOC.SP.Site();

		this.handleOnDrop = this.handleOnDrop.bind(this);
	}

	componentDidMount() { 
		this.init();
	}

	init() {
		const self = this;
	}

	handleOnDrop(files) {
		const self = this;
		const source = self.state.source;

		source.value = files[0].name;
		source.files = files;

		self.setState({ source }, () => {
			const uploadInput = self.state.source;    

			if (uploadInput && uploadInput.value) {
				self.setState({ excel: MergeObjects(self.state.excel, { loading: true }) }, () => {
					const parts = uploadInput.value.split('\\');
					const fileName = parts[parts.length - 1];                     

					self.site.Files(DOCUMENTSLIBRARY).upload(uploadInput).then(() => {  
						const path = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${DOCUMENTSLIBRARY}/${fileName}`);

						self.setState({ excel: MergeObjects(self.state.excel, { path }) }, () => {
							self.getExcelData(path); 
						});
					});
				});
			} 
		});
	}

	getExcelData(excelFilePath) {
		const self = this;

		AjaxTransport();

		$.ajax({
			url: excelFilePath,
			type: 'GET',
			dataType: 'binary',
			responseType: 'arraybuffer',
			processData: false,
			success: (response) => {
				const data = new Uint8Array(response);
				const arr = [];

				for (let i = 0; i !== data.length; ++i) {
					arr[i] = String.fromCharCode(data[i]);
				}

				const workbook = xlsx.read(arr.join(''), { type: 'binary' });

				const fieldsSheet = workbook.Sheets[self.excelSheetNames.fields];
				const listsSheet = workbook.Sheets[self.excelSheetNames.lists];
				const contentTypesSheet = workbook.Sheets[self.excelSheetNames.contentTypes];

				const excel = {
					fields: xlsx.utils.sheet_to_json(fieldsSheet),
					lists: xlsx.utils.sheet_to_json(listsSheet),
					contentTypes: xlsx.utils.sheet_to_json(contentTypesSheet),
					loading: false
				};

				self.setState({ 
					excel,
					xml: MergeObjects(self.state.xml, { loading: true })
				}, () => {
					const fields = GetFieldsXml(excel.fields, self.namespaces);

					if (fields) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { fields }), 
							loadingMessage: 'Fields' 
						}, () => {
							self.uploadFileToLibrary(fields, 'fields');
						});
					}

					const lists = GetListsXml(excel.lists);

					if (lists) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { lists }), 
							loadingMessage: 'Lists' 
						}, () => {
							self.uploadFileToLibrary(lists, 'lists');
						});
					}

					const contentTypes = GetContentTypesXml(excel.contentTypes, self.namespaces);

					if (contentTypes) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { contentTypes }), 
							loadingMessage: 'Content Types' 
						}, () => {
							self.uploadFileToLibrary(contentTypes, 'contentTypes');
						});
					}
				});                         
			}
		});
	}

	uploadFileToLibrary(xmlContent, xmlType) {
		const self = this;
		const fileName = self.xmlFileNames[xmlType];
		const fileCreateInfo = new SP.FileCreationInformation();

		fileCreateInfo.set_url(fileName);
		fileCreateInfo.set_overwrite(true);
		fileCreateInfo.set_content(new SP.Base64EncodedByteArray());

		xmlContent = FormatXml(xmlContent);

		for (let i = 0; i < xmlContent.length; i++) {
			fileCreateInfo.get_content().append(xmlContent.charCodeAt(i));
		}

		const context = SP.ClientContext.get_current();   
		const currentWeb = context.get_web();
		const documentsLibrary = currentWeb.get_lists().getByTitle(DOCUMENTSLIBRARY);
		const xmlFile = documentsLibrary.get_rootFolder().get_files().add(fileCreateInfo);

		context.load(xmlFile);
		context.executeQueryAsync(() => {
			const caml = new CamlBuilder()
							.View(['ID', 'FileRef', 'LinkFilename'])
							.Query()
							.Where()
							.ComputedField('LinkFilename')
							.EqualTo(fileName)
							.ToString();

			self.site.ListItems(DOCUMENTSLIBRARY).queryCSOM(caml).then((results) => {
				if (results && results.length > 0) {
					self.setState({ 
						xml: MergeObjects(self.state.xml, { loading: false }) 
					});
				}                   
			}); 
		}, (sender, args) => {
			console.log(args.get_message());
		});
	}

	render() {
		return (
			<ExcelTableView excel={this.state.excel} 
							xml={this.state.xml}
							source={this.state.source}  
							loadingMessage={this.state.loadingMessage}
							xmlFileNames={this.xmlFileNames}
							onDrop={this.handleOnDrop} />
		);
	}
}

export default ExcelTable;