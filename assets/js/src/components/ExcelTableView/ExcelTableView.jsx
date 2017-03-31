/* External libraries */
import $ from 'jquery';
import xlsx from 'xlsx';
import React from 'react';
import SPOC from 'SPOCExt';
import Dropzone from 'react-dropzone';
import Xslt from 'xslt';

/* Components */
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import CamlBuilder from '../../../vendor/camljs';
import { DOCUMENTSLIBRARY, FORMATXMLXSLT } from '../../utils/settings';
import { AjaxTransport, FormatXml } from '../../utils/utils';
import { GetFieldsXmlDefinition } from '../Controller/Fields/Fields';

/* CSS styles */
import Styles from './ExcelTableView.scss';

class ExcelTableView extends React.Component {
	constructor() {
		super();

		this.state = {
			excelContent: [],
			excelFilePath: '',
			excelUploadedFile: {
				value: '',
				files: []
			},
			excelFileLoading: false,
			xmlContent: '',
			xmlFilePath: '',
			xmlFileLoading: true
		};

		this.group = 'SPCrowd';
		this.prefix = 'SPCrowd';

		this.site = new SPOC.SP.Site();

		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnExcelClick = this.handleOnExcelClick.bind(this);
	}

	componentDidMount() { 
		this.init();
	}

	init() {
		const self = this;
	}

	handleOnExcelClick() {
		const self = this;

		self.setState({
			excelContent: [],
			excelFilePath: '',
			excelUploadedFile: {
				value: '',
				files: []
			},
			excelFileLoading: false,
			xmlContent: '',
			xmlFilePath: '',
			xmlFileLoading: true
		}, () => {
			self.dropzone.open();
		});
	}

	handleOnDrop(acceptedFiles) {
		const self = this;
		const excelUploadedFile = self.state.excelUploadedFile;

		excelUploadedFile.value = acceptedFiles[0].name;
		excelUploadedFile.files = acceptedFiles;

		self.setState({ excelUploadedFile }, () => {
			const uploadInput = self.state.excelUploadedFile;    

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
					excelContent: xlsx.utils.sheet_to_json(worksheet) 
				}, () => {
					const xmlContent = GetFieldsXmlDefinition(self.state.excelContent, self.group, self.prefix);

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
		const fileName = self.state.excelUploadedFile.value.replace('.xlsx', '.xml');
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
						xmlFileLoading: false,
						xmlFilePath: results[0].FileRef
					});
				}                   
			}); 
		}, (sender, args) => {
			console.log(args.get_message());
		});
	}

	render() {
		const self = this;
		const excelContent = self.state.excelContent;
		const show = excelContent && excelContent.length > 0;
		const content = show ? excelContent.map((item, i) => 
			<div key={i} className={`${Styles.item_row} ms-Grid-row`}>
				<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
					{item.Name}
				</div>
				<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
					{item.Type}
				</div>
				<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
					{item.Constraints}
				</div>
				<div className={`${Styles.item_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
					{item.Comments}
				</div>
			</div>
		) : null;

		let mainContent = null;

		if (show) {
			mainContent = (
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.header_row} ms-Grid-row`}>
							<div className={`${Styles.header_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
								Name
							</div>
							<div className={`${Styles.header_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
								Type
							</div>
							<div className={`${Styles.header_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
								Constraints
							</div>
							<div className={`${Styles.header_column} ${Styles.column} ms-Grid-col ms-u-sm3`}>	
								Comments
							</div>
						</div>
						{content}
					</div>
				</div>
			);
		}

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					Excel table
				</p>
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.header_row} ms-Grid-row`}>
							<div className={`${Styles.header_column} ${Styles.column} ${Styles.dropzone_container} ms-Grid-col ms-u-sm12`}>	
								<Dropzone className={Styles.dropzone} ref={(d) => { self.dropzone = d; }} onDrop={self.handleOnDrop}>
									<div className={Styles.dropzone_title}>
										Try dropping some files here, or click to select files to upload.
									</div>
								</Dropzone>
								<div className={Styles.buttons_container}>
									<div className={Styles.button} type="button" onClick={self.handleOnExcelClick}>
										Open Dropzone
									</div>
									{	
										!self.state.xmlFileLoading && self.state.xmlFilePath ? 
										(
											<a className={`${Styles.link_button} ${Styles.xml_button}`} href={self.state.xmlFilePath}>
												Download XML
											</a>
										) : null
									}
								</div>
								{
									self.state.excelUploadedFile.files.length > 0 ? (
										<div className={Styles.dropzone_files}>
											<div className={Styles.dropzone_files_list}>
												{
													self.state.excelUploadedFile.files.map((file, i) => 
														(
															<div className={Styles.dropzone_files_title} key={i}>
																{file.name}
															</div>
														)
													)
												}
											</div>
											{
												self.state.excelFileLoading ? 
												(
													<div className={Styles.excel_file_loading}>
														<Spinner label="is uploading..." />
													</div>
												) 
												: 
												(
													self.state.xmlFileLoading ? 
													(
														<div className={Styles.xml_file_loading}>
															<Spinner label="is processing..." />
														</div>
													) : null
												)
											}
										</div>
									) : null
								}
							</div>
						</div>
					</div>
				</div>
				{mainContent}
			</div>
		);
	}
}

export default ExcelTableView;