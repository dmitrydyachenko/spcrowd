/* External libraries */
import React from 'react';
import Dropzone from 'react-dropzone';

/* Components */
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import PivotView from '../Views/PivotView/PivotView';

/* CSS styles */
import Styles from './ExcelTableView.scss';

class ExcelTableView extends React.Component {
	static propTypes = {
		excel: React.PropTypes.objectOf(React.PropTypes.any),
		xml: React.PropTypes.objectOf(React.PropTypes.any),
		source: React.PropTypes.objectOf(React.PropTypes.any),
		loadingMessage: React.PropTypes.string,
		xmlFileNames: React.PropTypes.objectOf(React.PropTypes.string),
		onDrop: React.PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			excel: props.excel,
			xml: props.xml,
			source: props.source,
			loadingMessage: props.loadingMessage
		};

		this.handleOnDrop = this.handleOnDrop.bind(this);
		this.handleOnExcelClick = this.handleOnExcelClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			excel: nextProps.excel,
			xml: nextProps.xml,
			source: nextProps.source,
			loadingMessage: nextProps.loadingMessage
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
				<div className="ms-Grid-row">
					<div className={`${Styles.dropzone} ms-Grid-col ms-u-sm12`}>	
						<Dropzone className={Styles.dropzone_container} ref={(d) => { self.dropzone = d; }} onDrop={self.handleOnDrop}>
							<div className={Styles.dropzone_title}>
								Try dropping some files here, or click to select files to upload.
							</div>
						</Dropzone>
						<div className={Styles.dropzone_buttons}>
							<div className="button" type="button" onClick={self.handleOnExcelClick}>
								Open Dropzone
							</div>
						</div>
						{
							self.state.source.files.length > 0 ? 
							(
								<div className={Styles.dropzone_files}>
									{
										self.state.excel.loading ? 
										(
											<div className={Styles.loading}>
												<Spinner type={SpinnerType.large} label="Uploading..." />
											</div>
										) 
										: 
										(
											self.state.xml.loading ? 
											(
												<div className={Styles.loading}>
													<Spinner type={SpinnerType.large} 
																label={`${self.state.loadingMessage} are being processed...`} />
												</div>
											) 
											:
											(
												<div className={Styles.dropzone_files_list}>
													{
														self.state.source.files.map((file, i) => 
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
					<PivotView excel={self.state.excel} xmlFileNames={self.props.xmlFileNames} />
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

export default ExcelTableView;