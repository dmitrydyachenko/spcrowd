/* External libraries */
import $ from 'jquery';
import xlsx from 'xlsx';
import React from 'react';
import SPOC from 'SPOCExt';
import Data2xml from 'data2xml';
import Dropzone from 'react-dropzone';

/* CSS styles */
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import CamlBuilder from '../../../vendor/camljs';
import { AjaxTransport, ToCamelCase } from '../../utils/utils';
import { DOCUMENTSLIBRARY } from '../../utils/settings';
import Styles from './ExcelTableView.scss';

class ExcelTableView extends React.Component {
	constructor() {
		super();

		this.state = {
			completed: 0,
			submitting: false,
			filePath: '',
			uploadedFiles: {
				value: '',
				files: []
			}
		};

		this.prefix = 'SPCrowd';
		this.site = new SPOC.SP.Site();

		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	componentDidMount() { 
		this.init();
	}

	handleOnDrop(acceptedFiles) {
		const self = this;
		const uploadedFiles = self.state.uploadedFiles;

		uploadedFiles.value = acceptedFiles[0].name;
		uploadedFiles.files = acceptedFiles;

		self.setState({ uploadedFiles }, () => {
			const uploadInput = self.state.uploadedFiles;    

			if (uploadInput && uploadInput.value) {
				self.setState({ completed: 1, submitting: true }, () => {
					const parts = uploadInput.value.split('\\');
					const fileName = parts[parts.length - 1];                     
					const library = self.site.Files(DOCUMENTSLIBRARY);

					library.upload(uploadInput).then(() => {  
						const filePath = encodeURI(`${_spPageContextInfo.webServerRelativeUrl}/${DOCUMENTSLIBRARY}/${fileName}`);

						self.setState({ filePath }, () => {
							const caml = new CamlBuilder()
											.View(['ID', 'FileRef', 'LinkFilename'])
											.Query()
											.Where()
											.ComputedField('LinkFilename')
											.EqualTo(fileName)
											.ToString();

							self.site.ListItems(DOCUMENTSLIBRARY).queryCSOM(caml).then((results) => {
								if (results && results.length > 0) {									
									self.getExcel(self.state.filePath);
								}                   
							}); 
						});
					});
				});
			} 
		});
	}

	handleOnClick() {
		this.dropzone.open();
	}

	getExcel(filePath) {
		const self = this;

		AjaxTransport();

		$.ajax({
			url: filePath,
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
				const first_sheet_name = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[first_sheet_name];

				self.setState({ 
					submitting: false, 
					data: xlsx.utils.sheet_to_json(worksheet) 
				}, () => {
					self.getXml(self.state.data, self.prefix);
				});
			}
		});
	}

	getXml(data, prefix) {
		const convert = Data2xml({ xmlDecl: false });
		const formattedData = [];

		for (let i = 0; i < data.length; i++) {
			const type = data[i].Type;
			const lowerCaseType = type.toLowerCase().replace(/\s+/g, '');

			const _attr = { 
				Name: `${prefix}${ToCamelCase(data[i].Name)}`, 
				DisplayName: data[i].Name, 
				Type: type
			};

			let constraints = data[i].Constraints;

			let field = {};

			switch (lowerCaseType) {
				case 'text': 
					field = { _attr };
					break;
				case 'boolean': 
					field = { _attr, Default: constraints && constraints === 'Yes' ? 1 : 0 };
					break;
				case 'checkbox': 
				case 'dropdown': 
					_attr.Type = lowerCaseType === 'checkbox' ? 'MultiChoice' : 'Choice';

					field = { _attr };

					if (constraints) {
						constraints = constraints.split(',');

						if (constraints && constraints.length > 0) {
							const constraintsObject = [];

							for (let j = 0; j < constraints.length; j++) {
								constraintsObject.push({ _value: constraints[j].trim() });
							}

							field = { _attr, CHOICES: { CHOICE: constraintsObject } }; 
						}
					}
					break;
				case 'multiplelinesoftext': 
					_attr.NumLines = '6';
					_attr.RichText = 'TRUE';
					_attr.RichTextMode = 'FullHtml';

					if (constraints) {
						constraints = constraints.split(',');

						switch (constraints.length) {
							case 3:
								_attr.RichTextMode = constraints[2];
							case 2:
								_attr.RichText = constraints[1].toLowerCase().replace(/\s+/g, '') === 'richtext' ? 
													'TRUE' : 'FALSE';
							case 1:
								_attr.NumLines = constraints[0];
								break;
							default: 
								break;
						}
					} 

					_attr.Type = 'Note';

					field = { _attr };
					break;
				case 'hyperlinkorpicture':
					_attr.Format = 'URL';

					if (constraints) {
						const lowerCaseConstraints = constraints.toLowerCase().replace(/\s+/g, '');

						if (lowerCaseConstraints === 'hyperlink') {
							_attr.Format = 'URL';
						} else if (lowerCaseConstraints === 'picture') {
							_attr.Format = 'Image';
						}
					} 

					_attr.Type = 'URL';

					field = { _attr };
					break;
				case 'number':
					_attr.Min = '0';

					if (constraints && !isNaN(parseInt(constraints, 10))) {
						_attr.Min = constraints;
					} 

					_attr.Type = 'Number';

					field = { _attr };
					break;
				case 'dateandtime': case 'date':
					if (lowerCaseType === 'date') {
						_attr.Format = 'DateOnly';
					}
					_attr.Type = 'DateTime';
					field = { _attr };
					break;
				case 'person':
					_attr.Type = 'UserMulti';
					_attr.Mult = 'TRUE';
					_attr.UserSelectionMode = 'PeopleOnly';

					switch (constraints.toLowerCase().replace(/\s+/g, '')) {
						case 'peopleandgroups':
							_attr.Type = 'User';
							_attr.Mult = 'FALSE';
							_attr.UserSelectionMode = 'PeopleAndGroups';
							break;
						case 'peopleandgroupsmulti':
							_attr.Type = 'UserMulti';
							_attr.Mult = 'TRUE';
							_attr.UserSelectionMode = 'PeopleAndGroups';
							break;
						case 'peopleonly':
							_attr.Type = 'User';
							_attr.Mult = 'FALSE';
							_attr.UserSelectionMode = 'PeopleOnly';
							break;
						default: 
							break;
					}

					field = { _attr };
					break;
				default: 
					break;
			}

			formattedData.push(field);
		}

		let xml = convert('Field', formattedData);
		xml = `<Fields>${xml}</Fields>`;

		console.log(xml);
	}

	init() {
		const self = this;
	}

	render() {
		const self = this;
		const data = self.state.data;
		const show = data && data.length > 0;
		const content = show ? data.map((item, i) => 
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
								<button className={Styles.dropzone_button} type="button" onClick={self.handleOnClick}>
									Open Dropzone
								</button>
								{
									self.state.uploadedFiles.files.length > 0 ? (
										<div className={Styles.dropzone_files}>
											<div className={Styles.dropzone_files_list}>
												{
													self.state.uploadedFiles.files.map((file, i) => 
														(
															<div className={Styles.dropzone_files_title} key={i}>
																{file.name}
															</div>
														)
													)
												}
											</div>
											{
												self.state.submitting ? (
													<div className={Styles.dropzone_files_uploading}>
														<Spinner label="is uploading..." />
													</div>
												) : null
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