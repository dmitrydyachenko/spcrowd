/* External libraries */
import React from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

/* Components */
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as Settings from '../../../utils/settings';

/* CSS styles */
import Styles from './SettingsView.scss';

class SettingsView extends React.Component {
	static propTypes = {
		title: React.PropTypes.string,
		site: React.PropTypes.objectOf(React.PropTypes.any)
	};

	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			site: props.site,
			showPanel: false,
			message: '',
			listName: ''
		};

		this.handleOnSave = this.handleOnSave.bind(this);
		this.handleOnClosePanel = this.handleOnClosePanel.bind(this);
		this.handleOnShowPanel = this.handleOnShowPanel.bind(this);
		this.handleOnRenderFooterContent = this.handleOnRenderFooterContent.bind(this);
		this.handleListNameChange = this.handleListNameChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			title: nextProps.title,
			site: nextProps.site
		});
	}

	handleListNameChange(listName) {
		this.setState({ listName });
	}

	handleOnSave() {
		const self = this;

		if (self.state.listName) {
			let settings = {
				select: 'ID, Title, Value',
				filter: 'Title eq \'DocumentLibrary\''
			};

			self.state.site.ListItems(Settings.SETTINGSLIST)
				.query(settings)
				.then((results) => {
					if (results && results.length > 0) {
						settings = {
							Value: self.state.listName
						};

						self.state.site.ListItems(Settings.SETTINGSLIST).update(results[0].ID, settings).then(() => { 
							NotificationManager.success('Successfully updated');
						}, (error) => {  
							console.log(JSON.parse(error.response).error.message.value);
						});
					} else {
						settings = {
							Title: 'DocumentLibrary',
							Value: self.state.listName
						};

						self.state.site.ListItems(Settings.SETTINGSLIST).create(settings).then(() => {
							NotificationManager.success('Successfully added');
						}, (error) => {  
							console.log(JSON.parse(error.response).error.message.value);
						});
					}
				});
		} else {
			NotificationManager.error('Please, fill in all required fields');
		}
	}

	handleOnClosePanel() {
		this.setState({ showPanel: false });
	}

	handleOnShowPanel() {
		this.setState({ showPanel: true });
	}

	handleOnRenderFooterContent() {
		return (
			<div>
				Footer
			</div>
		);
	}

	render() {
		const self = this;

		const mainContent = (
			<div className={Styles.content}>
				<div>
					<div>
						<div className={Styles.list_name}>
							<TextField label="Document library name" 
										placeholder="A place to store Excel and XML files"
										onChanged={self.handleListNameChange} 
										value={self.state.listName} />
						</div>
					</div>
				</div>
				<div>
					<div className={Styles.save}>
						<div className="button" onClick={self.handleOnSave}>
							Save
						</div>
					</div>
					<div className={Styles.cancel}>
						<div className="button cancel" onClick={self.handleOnClosePanel}>
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
				<div className="button" onClick={self.handleOnShowPanel}>
					Open settings
				</div>
				<Panel headerText="Settings" 
						hasCloseButton={false}
						type={PanelType.medium}
						isOpen={self.state.showPanel}
						onDismiss={self.handleOnClosePanel}
						onRenderFooterContent={self.handleOnRenderFooterContent}>
					{mainContent}
				</Panel>
			</div>
		);
	}
}

export default SettingsView;