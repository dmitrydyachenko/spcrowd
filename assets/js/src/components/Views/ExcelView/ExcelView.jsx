import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import SettingsViewContainer from '../SettingsView/SettingsViewContainer';
import PivotView from '../PivotView/PivotView';

import Styles from './ExcelView.scss';

const ExcelView = (props) => {
	let dropzone;

	const {
		excel,
		xml,
		source,
		xmlFileNames,
		site,
		loadingMessage,
		listName,
		prefixName,
		groupName,
		useContentTypePrefix,
		useListPrefix,
		onDrop,
		onDownloadAllClick,
		setListName,
		setPrefixName,
		setGroupName,
		setContentTypesPrefix,
		setListsPrefix
	} = props;

	const mainContent = (
		<div className="ms-Grid">
			<div className="ms-Grid-row">
				<div className={`${Styles.dropzone} ms-Grid-col ms-u-sm12`}>	
					<Dropzone className={Styles.dropzone_container} 
								ref={(d) => { dropzone = d; }} onDrop={onDrop}>
						<div className={Styles.dropzone_title}>
							Try dropping some files here, or click to select files to upload.
						</div>
					</Dropzone>
					<div className={`${Styles.dropzone_buttons} ms-Grid-row`}>
						<div className="ms-Grid-col ms-u-sm6">	
							<div className="button" onClick={() => { dropzone.open(); }}>
								Open Dropzone
							</div>
						</div>
						<div className="ms-Grid-col ms-u-sm6">	
							<SettingsViewContainer site={site} 
													listName={listName}
													prefixName={prefixName}
													groupName={groupName}
													useContentTypePrefix={useContentTypePrefix}
													useListPrefix={useListPrefix}
													setListName={setListName}
													setPrefixName={setPrefixName}
													setGroupName={setGroupName}
													setContentTypesPrefix={setContentTypesPrefix}
													setListsPrefix={setListsPrefix} />
						</div>
					</div>
					{
						source.files.length > 0 ? 
						(
							<div className={Styles.dropzone_files}>
								{
									excel.loading ? 
									(
										<div className={Styles.loading}>
											<Spinner type={SpinnerType.large} label="Uploading..." />
										</div>
									) 
									: 
									(
										xml.loading ? 
										(
											<div className={Styles.loading}>
												<Spinner type={SpinnerType.large} 
															label={`${loadingMessage} are being processed...`} />
											</div>
										) 
										:
										(
											<div className={Styles.dropzone_files_list}>
												{
													source.files.map((file, i) => 
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
						source.files.length > 0 && !excel.loading && !xml.loading ? 
						(
							<div className={`${Styles.download_all} ms-Grid-row`}>
								<div className="ms-Grid-col ms-u-sm12">	
									<div className="button" onClick={onDownloadAllClick}>
										Download all XMLs
									</div>
								</div>
							</div>
						) : null
					}
				</div>
			</div>
			<div className={`${Styles.content_row} ms-Grid-row`}>
				<PivotView excel={excel} xmlFileNames={xmlFileNames} listName={listName} />
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
};

ExcelView.propTypes = {
	excel: PropTypes.objectOf(PropTypes.any),
	xml: PropTypes.objectOf(PropTypes.any),
	source: PropTypes.objectOf(PropTypes.any),	
	xmlFileNames: PropTypes.objectOf(PropTypes.string),
	site: PropTypes.objectOf(PropTypes.any),	
	loadingMessage: PropTypes.string,
	listName: PropTypes.string,
	prefixName: PropTypes.string,
	groupName: PropTypes.string,
	useContentTypePrefix: PropTypes.bool,
	useListPrefix: PropTypes.bool,
	onDrop: PropTypes.func,
	onDownloadAllClick: PropTypes.func,
	setListName: PropTypes.func,
	setPrefixName: PropTypes.func,
	setGroupName: PropTypes.func,
	setContentTypesPrefix: PropTypes.func,
	setListsPrefix: PropTypes.func
};

export default ExcelView;