import React from 'react';
import PropTypes from 'prop-types';
import { NotificationContainer } from 'react-notifications';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import Styles from './SettingsView.scss';

const SettingsView = (props) => {
	const {
		listName,
		showPanel,
		onListNameChange,
		onSave,
		onShowPanel,
		onClosePanel,
		onRenderFooterContent
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
				<div className={Styles.save}>
					<div className="button" onClick={onSave}>
						Save
					</div>
				</div>
				<div className={Styles.cancel}>
					<div className="button cancel" onClick={onClosePanel}>
						Cancel
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
	showPanel: PropTypes.bool,
	onListNameChange: PropTypes.func,
	onSave: PropTypes.func,
	onShowPanel: PropTypes.func,
	onClosePanel: PropTypes.func,
	onRenderFooterContent: PropTypes.func
};

export default SettingsView;