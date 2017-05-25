/* External libraries */
import $ from 'jquery';
import xlsx from 'xlsx';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SPOC from 'SPOCExt';

/* Components */
import * as Settings from '../../utils/settings';
import CamlBuilder from '../../../vendor/camljs';
import { AjaxTransport, FormatXml, MergeObjects } from '../../utils/utils';
import { GetFieldsXml } from '../Controllers/Fields/Fields';
import { GetListsXml } from '../Controllers/Lists/Lists';
import { GetContentTypesXml } from '../Controllers/ContentTypes/ContentTypes';
import { GetGroupsXml } from '../Controllers/Groups/Groups';
import ExcelViewContainer from '../Views/ExcelView/ExcelViewContainer';

export default class ContentTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			excel: {
				fields: [],
				lists: [],
				contentTypes: [],
				groups: [],
				fieldsMapping: [],
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
			loadingMessage: ''
		};

		this.site = new SPOC.SP.Site();

		this.handleOnDrop = this.handleOnDrop.bind(this);
	}

	componentDidMount() { 
		this.init();
	}

	init() {
		const { 
			setListName,
			setPrefixName,
			setGroupName,
			setContentTypesPrefix,
			setListsPrefix
		} = this.props;

		const promises = [];           

		promises.push(this.getSettings('DocumentLibrary', setListName));
		promises.push(this.getSettings('Prefix', setPrefixName));
		promises.push(this.getSettings('Group', setGroupName));
		promises.push(this.getSettings('UseContentTypePrefix', setContentTypesPrefix, this.convertToBool));
		promises.push(this.getSettings('UseListPrefix', setListsPrefix, this.convertToBool));

		$.when(...promises);
	}

	getSettings(title, updateStateFunction, convertValueFunction) {
		const settings = {
			select: 'ID, Title, Value',
			filter: `Title eq '${title}'`
		};

		const dfd = $.Deferred(() => { 
			this.site.ListItems(Settings.SETTINGSLIST).query(settings).then((results) => {
				if (results && results.length > 0) {
					updateStateFunction(convertValueFunction ? 
										convertValueFunction(results[0].Value) : results[0].Value);	
				}

				dfd.resolve();
			});	
		});

		return dfd.promise(); 	
	}

	convertToBool(value) {
		return value === 'Yes';
	}

	handleOnDrop(files) {
		const self = this;

		const uploadInput = self.props.setSource({
			value: files[0].name,
			files
		}).source;    

		if (uploadInput && uploadInput.value) {
			self.setState({ excel: MergeObjects(self.state.excel, { loading: true }) }, () => {
				const parts = uploadInput.value.split('\\');
				const fileName = parts[parts.length - 1];     
				const listName = self.props.contentTable.listName;               

				self.site.Files(listName).upload(uploadInput).then(() => {  
					const path = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${listName}/${fileName}`);

					self.setState({ excel: MergeObjects(self.state.excel, { path }) }, () => {
						self.getExcelData(path); 
					});
				});
			});
		} 
	}

	getExcelData(excelFilePath) {
		const self = this;
		const { 
			prefixName, 
			groupName, 
			useListPrefix, 
			useContentTypePrefix 
		} = self.props.contentTable;

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
				const fieldsMappingSheet = workbook.Sheets[Settings.EXCELSHEETNAMES.fieldsMapping];

				const excel = {
					fields: xlsx.utils.sheet_to_json(fieldsSheet),
					lists: xlsx.utils.sheet_to_json(listsSheet),
					contentTypes: xlsx.utils.sheet_to_json(contentTypesSheet),
					groups: xlsx.utils.sheet_to_json(groupsSheet),
					fieldsMapping: xlsx.utils.sheet_to_json(fieldsMappingSheet),
					loading: false
				};

				self.setState({ 
					excel,
					xml: MergeObjects(self.state.xml, { loading: true })
				}, () => {
					const fields = GetFieldsXml(excel.fields, prefixName, groupName);

					if (fields) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { fields }), 
							loadingMessage: 'Fields' 
						}, () => {
							self.uploadFileToLibrary(fields, 'fields');
						});
					}

					const lists = GetListsXml(excel.lists, useListPrefix ? prefixName : '');

					if (lists) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { lists }), 
							loadingMessage: 'Lists' 
						}, () => {
							self.uploadFileToLibrary(lists, 'lists');
						});
					}

					const contentTypes = GetContentTypesXml(excel.contentTypes, 
															excel.fieldsMapping, 
															useContentTypePrefix ? prefixName : '', 
															groupName);

					if (contentTypes) {
						self.setState({ 
							xml: MergeObjects(self.state.xml, { contentTypes }), 
							loadingMessage: 'Content Types' 
						}, () => {
							self.uploadFileToLibrary(contentTypes, 'contentTypes');
						});
					}

					const groups = GetGroupsXml(excel.groups);

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
		const listName = self.props.contentTable.listName;    
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
		const documentsLibrary = currentWeb.get_lists().getByTitle(listName);
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

			self.site.ListItems(listName).queryCSOM(caml).then((results) => {
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
		const {
			contentTable,
			setListName,
			setPrefixName,
			setGroupName,
			setContentTypesPrefix,
			setListsPrefix
		} = this.props;

		return (
			<ExcelViewContainer
				excel={this.state.excel} 
				xml={this.state.xml}
				source={contentTable.source}  
				loadingMessage={this.state.loadingMessage}
				listName={contentTable.listName}
				prefixName={contentTable.prefixName}
				groupName={contentTable.groupName}
				useContentTypePrefix={contentTable.useContentTypePrefix}
				useListPrefix={contentTable.useListPrefix}
				onDrop={this.handleOnDrop}
				site={this.site}
				xmlFileNames={Settings.XMLFILENAMES}
				setListName={setListName}
				setPrefixName={setPrefixName}
				setGroupName={setGroupName}
				setContentTypesPrefix={setContentTypesPrefix}
				setListsPrefix={setListsPrefix} />
		);
	}
}

ContentTable.propTypes = {
	contentTable: PropTypes.objectOf(PropTypes.any),
	setSource: PropTypes.func,
	setListName: PropTypes.func,
	setPrefixName: PropTypes.func,
	setGroupName: PropTypes.func,
	setContentTypesPrefix: PropTypes.func,
	setListsPrefix: PropTypes.func
};