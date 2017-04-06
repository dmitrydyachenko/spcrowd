/* External libraries */
import $ from 'jquery';
import xlsx from 'xlsx';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import * as Settings from '../../utils/settings';
import CamlBuilder from '../../../vendor/camljs';
import { AjaxTransport, FormatXml, MergeObjects } from '../../utils/utils';
import { GetFieldsXml } from '../Controllers/Fields/Fields';
import { GetListsXml } from '../Controllers/Lists/Lists';
import { GetContentTypesXml } from '../Controllers/ContentTypes/ContentTypes';
import { GetGroupsXml } from '../Controllers/Groups/Groups';
import ExcelTableView from '../Views/ExcelTableView/ExcelTableView';

class ExcelTable extends React.Component {
	constructor() {
		super();

		this.state = {
			excel: {
				fields: [],
				lists: [],
				contentTypes: [],
				groups: [],
				path: '',
				loading: false
			},
			xml: {
				fields: [],
				lists: [],
				contentTypes: [],
				groups: [],
				loading: true
			},
			source: { value: '', files: [] },
			loadingMessage: ''
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

					self.site.Files(Settings.DOCUMENTSLIBRARY).upload(uploadInput).then(() => {  
						const path = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${Settings.DOCUMENTSLIBRARY}/${fileName}`);

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

				const fieldsSheet = workbook.Sheets[Settings.EXCELSHEETNAMES.fields];
				const listsSheet = workbook.Sheets[Settings.EXCELSHEETNAMES.lists];
				const contentTypesSheet = workbook.Sheets[Settings.EXCELSHEETNAMES.contentTypes];
				const groupsSheet = workbook.Sheets[Settings.EXCELSHEETNAMES.groups];

				const excel = {
					fields: xlsx.utils.sheet_to_json(fieldsSheet),
					lists: xlsx.utils.sheet_to_json(listsSheet),
					contentTypes: xlsx.utils.sheet_to_json(contentTypesSheet),
					groups: xlsx.utils.sheet_to_json(groupsSheet),
					loading: false
				};

				self.setState({ 
					excel,
					xml: MergeObjects(self.state.xml, { loading: true })
				}, () => {
					const fields = GetFieldsXml(excel.fields, Settings.NAMESPACES);

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

					const contentTypes = GetContentTypesXml(excel.contentTypes, Settings.NAMESPACES);

					if (contentTypes) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { contentTypes }), 
							loadingMessage: 'Content Types' 
						}, () => {
							self.uploadFileToLibrary(contentTypes, 'contentTypes');
						});
					}

					const groups = GetGroupsXml(excel.groups, Settings.NAMESPACES);

					if (groups) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { groups }), 
							loadingMessage: 'Groups' 
						}, () => {
							self.uploadFileToLibrary(groups, 'groups');
						});
					}
				});                         
			}
		});
	}

	uploadFileToLibrary(xmlContent, xmlType) {
		const self = this;
		const fileName = Settings.XMLFILENAMES[xmlType];
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
		const documentsLibrary = currentWeb.get_lists().getByTitle(Settings.DOCUMENTSLIBRARY);
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

			self.site.ListItems(Settings.DOCUMENTSLIBRARY).queryCSOM(caml).then((results) => {
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
							xmlFileNames={Settings.XMLFILENAMES}
							onDrop={this.handleOnDrop} />
		);
	}
}

export default ExcelTable;