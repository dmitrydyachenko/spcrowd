/* External libraries */
import React from 'react';
import Dropzone from 'react-dropzone';

/* Components */
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import FieldsView from '../Views/Fields/Fields';

/* CSS styles */
import Styles from './ExcelTableView.scss';

class ExcelTableView extends React.Component {
	static propTypes = {
		excelFields: React.PropTypes.arrayOf(React.PropTypes.object),
		excelFiles: React.PropTypes.arrayOf(React.PropTypes.object),
		xmlFilePath: React.PropTypes.string,
		excelFileLoading: React.PropTypes.bool,
		xmlFileLoading: React.PropTypes.bool,
		onDrop: React.PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			excelFileLoading: props.excelFileLoading,
			xmlFileLoading: props.xmlFileLoading
		};

		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnExcelClick = this.handleOnExcelClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			excelFileLoading: nextProps.excelFileLoading, 
			xmlFileLoading: nextProps.xmlFileLoading 
		});
	}

	handleOnExcelClick() {
		this.dropzone.open();
	}

	handleOnDrop(files) {
		if (this.props.onDrop) {
			this.props.onDrop(files);	
		}
	}

	render() {
		const self = this;

		const mainContent = (
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
						</div>
						{
							self.props.excelFiles.length > 0 ? 
							(
								<div className={Styles.dropzone_files}>
									{
										self.state.excelFileLoading ? 
										(
											<div className={Styles.loading}>
												<Spinner type={SpinnerType.large} label="Uploading..." />
											</div>
										) 
										: 
										(
											self.state.xmlFileLoading ? 
											(
												<div className={Styles.loading}>
													<Spinner type={SpinnerType.large} label="Processing..." />
												</div>
											) 
											:
											(
												<div className={Styles.dropzone_files_list}>
													{
														self.props.excelFiles.map((file, i) => 
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
					</div>
				</div>
				<div className={`${Styles.content_row} ms-Grid-row`}>
					<Pivot linkSize={PivotLinkSize.large}>
						<PivotItem linkText="Fields">
							{
								self.props.excelFields && self.props.excelFields.length > 0 ? 
								(
									<FieldsView data={self.props.excelFields} 
												xmlFilePath={self.props.xmlFilePath}
												columns={['Name', 'Type', 'Constraints', 'Comments']} 
												title="Fields table" />
								) 
								:
								(
									<div className={Styles.upload_message}>
										Upload an Excel file to see fields definition
									</div>
								)
							}
						</PivotItem>
						<PivotItem linkText="Lists">
							<div>Lists are coming soon</div>
						</PivotItem>
						<PivotItem linkText="Content Types">
							<div>Content Types are coming soon</div>
						</PivotItem>
					</Pivot>
				</div>
			</div>
		);

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					Excel tables
				</p>
				<div className={Styles.content}>
					{mainContent}
				</div>
			</div>
		);
	}
}

export default ExcelTableView;