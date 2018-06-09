import React from 'react';
import PropTypes from 'prop-types';
import { NotificationContainer } from 'react-notifications';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import Styles from './SettingsView.scss';

const SettingsView = (props) => {
	const {
		listName,
		prefixName,
		groupName,
		showPanel,
		useContentTypePrefix,
		useListPrefix,
		onListNameChange,
		onPrefixNameChange,
		onGroupNameChange,
		onSave,
		onShowPanel,
		onClosePanel,
		onRenderFooterContent,
		onUseForContentTypesChange,
		onUseForListsChange
	} = props;

	const mainContent = (
		<div className={Styles.content}>
			<div>
				<div>
					<div className={Styles.list_name}>
						<TextField label="Document library name" 
									placeholder="A place to store Excel and XML files"
									onChanged={onListNameChange} 
									value={listName} />
					</div>
				</div>
			</div>
			<div>
				<div>
					<div className={Styles.group_name}>
						<TextField label="Group name" 
									placeholder="Group name for fields and content types"
									onChanged={onGroupNameChange} 
									value={groupName} />
					</div>
				</div>
			</div>
			<div>
				<div>
					<div className={Styles.prefix_name}>
						<TextField label="Project prefix" 
									placeholder="Prefix for field, content type and list names"
									onChanged={onPrefixNameChange} 
									value={prefixName} />
					</div>
				</div>
			</div>
			<div>
				<div>
					<div className={Styles.use_prefix_content_type}>
						<Toggle checked={useContentTypePrefix}
								label="Use prefix for Content Types"
								onText="Yes"
								offText="No"
								onChanged={onUseForContentTypesChange} />
					</div>
				</div>
			</div>
			<div>
				<div>
					<div className={Styles.use_prefix_list}>
						<Toggle checked={useListPrefix}
								label="Use prefix for Lists"
								onText="Yes"
								offText="No"
								onChanged={onUseForListsChange} />
					</div>
				</div>
			</div>
			<div>
				<div className={Styles.save}>
					<div className="button" onClick={onSave}>
						Save
					</div>
				</div>
				<div className={Styles.cancel}>
					<div className="button cancel" onClick={onClosePanel}>
						Close
					</div>
				</div>
				<div className={Styles.notification}>
					<NotificationContainer />
				</div>
			</div>
		</div>
	);

	return (
		<div className={Styles.container}>
			<div className="button" onClick={onShowPanel}>
				Open settings
			</div>
			<Panel headerText="Settings" 
					hasCloseButton={false}
					type={PanelType.medium}
					isOpen={showPanel}
					onDismiss={onClosePanel}
					onRenderFooterContent={onRenderFooterContent}>
				{mainContent}
			</Panel>
		</div>
	);
};

SettingsView.propTypes = {
	listName: PropTypes.string,
	prefixName: PropTypes.string,
	groupName: PropTypes.string,
	showPanel: PropTypes.bool,
	useContentTypePrefix: PropTypes.bool,
	useListPrefix: PropTypes.bool,
	onListNameChange: PropTypes.func,
	onPrefixNameChange: PropTypes.func,
	onGroupNameChange: PropTypes.func,
	onSave: PropTypes.func,
	onShowPanel: PropTypes.func,
	onClosePanel: PropTypes.func,
	onRenderFooterContent: PropTypes.func,
	onUseForContentTypesChange: PropTypes.func,
	onUseForListsChange: PropTypes.func
};

export default SettingsView;