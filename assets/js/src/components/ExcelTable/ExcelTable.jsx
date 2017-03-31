/* External libraries */
import $ from 'jquery';
import xlsx from 'xlsx';
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import CamlBuilder from '../../../vendor/camljs';
import { DOCUMENTSLIBRARY } from '../../utils/settings';
import { AjaxTransport, FormatXml } from '../../utils/utils';
import { GetFieldsXmlDefinition } from '../Controller/Fields/Fields';
import ExcelTableView from './ExcelTableView';

class ExcelTable extends React.Component {
	constructor() {
		super();

		this.state = {
			excelFields: [],
			excelFilePath: '',
			excelFile: { value: '', files: [] },
			excelFileLoading: false,
			xmlContent: '',
			xmlFilePath: '',
			xmlFileLoading: true
		};

		this.xmlFileName = 'Fields.xml';
		this.group = 'SPCrowd';
		this.prefix = 'SPCrowd';

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
		const excelFile = self.state.excelFile;

		excelFile.value = files[0].name;
		excelFile.files = files;

		self.setState({ excelFile }, () => {
			const uploadInput = self.state.excelFile;    

			if (uploadInput && uploadInput.value) {
				self.setState({ excelFileLoading: true }, () => {
					const parts = uploadInput.value.split('\\');
					const fileName = parts[parts.length - 1];                     

					self.site.Files(DOCUMENTSLIBRARY).upload(uploadInput).then(() => {  
						const excelFilePath = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${DOCUMENTSLIBRARY}/${fileName}`);

						self.setState({ excelFilePath }, () => {
							self.getExcelData(self.state.excelFilePath); 
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
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];

				self.setState({ 
					excelFileLoading: false, 
					xmlFileLoading: true,
					excelFields: xlsx.utils.sheet_to_json(worksheet) 
				}, () => {
					const xmlContent = GetFieldsXmlDefinition(self.state.excelFields, self.group, self.prefix);

					if (xmlContent) {
						self.setState({ xmlContent }, () => {
							self.uploadFileToLibrary(self.state.xmlContent);
						});
					}
				});                         
			}
		});
	}

	uploadFileToLibrary(xmlContent) {
		const self = this;
		const fileName = this.xmlFileName;
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
					self.setState({ xmlFileLoading: false, xmlFilePath: results[0].FileRef });
				}                   
			}); 
		}, (sender, args) => {
			console.log(args.get_message());
		});
	}

	render() {
		return (
			<ExcelTableView excelFields={this.state.excelFields} 
							excelFiles={this.state.excelFile.files} 
							xmlFilePath={this.state.xmlFilePath}
							excelFileLoading={this.state.excelFileLoading}
							xmlFileLoading={this.state.xmlFileLoading}
							onDrop={this.handleOnDrop} />
		);
	}
}

export default ExcelTable;