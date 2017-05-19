import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import * as Settings from '../../../utils/settings';

import SettingsView from './SettingsView';

export default class SettingsViewContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showPanel: false
		};

		this.handleOnSave = this.handleOnSave.bind(this);
		this.handleOnClosePanel = this.handleOnClosePanel.bind(this);
		this.handleOnShowPanel = this.handleOnShowPanel.bind(this);
		this.handleOnRenderFooterContent = this.handleOnRenderFooterContent.bind(this);
		this.handleListNameChange = this.handleListNameChange.bind(this);
	}

	handleListNameChange(listName) {
		this.props.setListName(listName);
	}

	handleOnSave() {
		const {
			site,
			listName
		} = this.props;

		if (site && listName) {
			let settings = {
				select: 'ID, Title, Value',
				filter: 'Title eq \'DocumentLibrary\''
			};

			site.ListItems(Settings.SETTINGSLIST)
				.query(settings)
				.then((results) => {
					if (results && results.length > 0) {
						settings = {
							Value: listName
						};

						site.ListItems(Settings.SETTINGSLIST).update(results[0].ID, settings).then(() => { 
							NotificationManager.success('Successfully updated');
						}, (error) => {  
							console.log(JSON.parse(error.response).error.message.value);
						});
					} else {
						settings = {
							Title: 'DocumentLibrary',
							Value: listName
						};

						site.ListItems(Settings.SETTINGSLIST).create(settings).then(() => {
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
		const {
			listName
		} = this.props;

		return (
			<SettingsView 
				listName={listName}
				showPanel={this.state.showPanel}
				onListNameChange={list => this.handleListNameChange(list)}
				onSave={() => this.handleOnSave()}
				onShowPanel={() => this.handleOnShowPanel()}
				onClosePanel={() => this.handleOnClosePanel()}
				onRenderFooterContent={() => this.handleOnRenderFooterContent()} />
		);
	}
}

SettingsViewContainer.propTypes = {
	site: React.PropTypes.objectOf(React.PropTypes.any),
	listName: PropTypes.string,
	setListName: PropTypes.func
};