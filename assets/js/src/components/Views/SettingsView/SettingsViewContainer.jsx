import $ from 'jquery';
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
		this.handlePrefixNameChange = this.handlePrefixNameChange.bind(this);
		this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
		this.handleOnUseForContentTypesChange = this.handleOnUseForContentTypesChange.bind(this);
		this.handleOnUseForListsChange = this.handleOnUseForListsChange.bind(this);
	}

	handleListNameChange(listName) {
		this.props.setListName(listName);
	}

	handlePrefixNameChange(prefixName) {
		this.props.setPrefixName(prefixName);
	}

	handleGroupNameChange(groupName) {
		this.props.setGroupName(groupName);
	}

	handleOnUseForContentTypesChange() {
		this.props.setContentTypesPrefix(!this.props.useContentTypePrefix);
	}

	handleOnUseForListsChange() {
		this.props.setListsPrefix(!this.props.useListPrefix);
	}

	handleOnSave() {
		const {
			listName,
			prefixName,
			groupName,
			useContentTypePrefix,
			useListPrefix
		} = this.props;

		if (!listName) {
			NotificationManager.error('Please, specify a Document library name');
			return;
		}

		if (!groupName) {
			NotificationManager.error('Please, specify a Group name');
			return;
		}

		const promises = [];           

		promises.push(this.updateSettings('DocumentLibrary', listName));
		promises.push(this.updateSettings('Prefix', prefixName));
		promises.push(this.updateSettings('Group', groupName));
		promises.push(this.updateSettings('UseContentTypePrefix', useContentTypePrefix ? 'Yes' : 'No'));
		promises.push(this.updateSettings('UseListPrefix', useListPrefix ? 'Yes' : 'No'));

		$.when(...promises).then(NotificationManager.success('Successfully updated'));
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

	updateSettings(title, value) {
		const { site } = this.props;

		let settings = {
			select: 'ID, Title, Value, User/Id',
			filter: `Title eq '${title}' and User/Id eq ${_spPageContextInfo.userId}`,
			expand: 'User'
		};

		const dfd = $.Deferred(() => { 
			if (site) {
				site.ListItems(Settings.SETTINGSLIST)
					.query(settings)
					.then((results) => {
						if (results && results.length > 0) {
							settings = {
								Value: value
							};

							site.ListItems(Settings.SETTINGSLIST).update(results[0].ID, settings).then(() => { 
								dfd.resolve();     
							}, 
							(error) => {  
								console.log(JSON.parse(error.response).error.message.value);
							});
						} else {
							settings = {
								Title: title,
								Value: value,
								UserId: _spPageContextInfo.userId
							};

							site.ListItems(Settings.SETTINGSLIST).create(settings).then(() => { 
								dfd.resolve();     
							}, 
							(error) => {  
								console.log(JSON.parse(error.response).error.message.value);
							});
						}
					});
			}
		});

		return dfd.promise(); 		
	}

	render() {
		const {
			listName,
			prefixName,
			groupName,
			useContentTypePrefix,
			useListPrefix
		} = this.props;

		return (
			<SettingsView 
				listName={listName}
				prefixName={prefixName}
				groupName={groupName}
				showPanel={this.state.showPanel}
				useContentTypePrefix={useContentTypePrefix}
				useListPrefix={useListPrefix}
				onListNameChange={list => this.handleListNameChange(list)}
				onPrefixNameChange={prefix => this.handlePrefixNameChange(prefix)}
				onGroupNameChange={group => this.handleGroupNameChange(group)}
				onSave={() => this.handleOnSave()}
				onShowPanel={() => this.handleOnShowPanel()}
				onClosePanel={() => this.handleOnClosePanel()}
				onRenderFooterContent={() => this.handleOnRenderFooterContent()}
				onUseForContentTypesChange={() => this.handleOnUseForContentTypesChange()}
				onUseForListsChange={() => this.handleOnUseForListsChange()} />
		);
	}
}

SettingsViewContainer.propTypes = {
	site: React.PropTypes.objectOf(React.PropTypes.any),
	listName: PropTypes.string,
	prefixName: PropTypes.string,
	groupName: PropTypes.string,
	useContentTypePrefix: PropTypes.bool,
	useListPrefix: PropTypes.bool,
	setListName: PropTypes.func,
	setPrefixName: PropTypes.func,
	setGroupName: PropTypes.func,
	setContentTypesPrefix: PropTypes.func,
	setListsPrefix: PropTypes.func
};