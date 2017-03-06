import $ from 'jquery';

export function GetRoleDefinitions(self) {
	$.ajax({
		url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/RoleDefinitions?$select=Id,Name&$filter=Name eq 'Full Control' or Name eq 'Contribute' or Name eq 'Read'`,
		type: 'GET',
		contentType: 'application/json;odata=verbose',
		headers: {
			Accept: 'application/json;odata=verbose'
		},
		success: (data) => {
			const results = (data && data.d && data.d.results && data.d.results.length > 0 ? data.d.results : null);

			if (results && results.length > 0) {
				const roleDefinitions = {};

				results.forEach((roleDefinition) => {
					roleDefinitions[roleDefinition.Name] = roleDefinition.Id;
				});

				self.setState({ roleDefinitions });
			}                            
		}
	}); 
}

export function GetUsers() {
	return $.ajax({
		url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/siteusers`,
		type: 'GET',
		contentType: 'application/json;odata=verbose',
		headers: {
			Accept: 'application/json;odata=verbose'
		}
	}); 
}

export function GetClusters(listName) {
	const filterString = "$select=TermSetId&$filter=InternalName eq 'ProjectClusters'";

	return $.ajax({
		url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getbytitle('${listName}')/Fields?${filterString}`,
		type: 'GET',
		contentType: 'application/json;odata=verbose',
		headers: {
			Accept: 'application/json;odata=verbose'
		}
	});           
}

export function GetClustersValues(clusters, termSetId, self, afterSetState) {
	const context = SP.ClientContext.get_current();            
	const taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
	const termStore = taxSession.getDefaultSiteCollectionTermStore();
	const termSet = termStore.getTermSet(termSetId);
	const terms = termSet.get_terms();

	context.load(terms);

	context.executeQueryAsync(() => {
		const termEnumerator = terms.getEnumerator();
		const results = [];

		while (termEnumerator.moveNext()) {
			const currentTerm = termEnumerator.get_current();
			const text = currentTerm.get_name();
			const key = currentTerm.get_id()._m_guidString$p$0;

			results.push({ key, text });
		}

		const values = results.map(item => ({ key: item.key, name: item.text }));

		self.setState({ [clusters]: values }, () => {
			if (afterSetState) {
				afterSetState();
			}
		});
	}, (sender, args) => {
		console.log(args.get_message());
	});
}

export function GetClusterInternalName(listName) {
	return $.ajax({
		url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getbytitle('${listName}')/Fields/GetByTitle('ProjectClusters_0')/InternalName`,
		type: 'GET',
		contentType: 'application/json;odata=verbose',
		headers: {
			Accept: 'application/json;odata=verbose'
		}
	}); 
} 

export function SetClustersValues(clusters, internalName, setSettingsValue, self) { 
	if (clusters && clusters.length > 0 && internalName) {
		let value = '';

		clusters.forEach((cluster) => {
			value += `-1;#${cluster.name}|${cluster.key};#`;
		});

		value = value.replace(/#$/, '');

		if (setSettingsValue) {
			setSettingsValue(value, internalName, self);
		}
	}
}

export function GetYearOfLaunchingErrorMessage(value) {
	return !value || /^[12][0-9]{3}$/.test(value) ? '' : 'Incorrect year format';
}

export function GetStraplineErrorMessage(value) {
	return value.length < 255 ? '' : `The length of description should be less than 255, actual length is ${value.length}.`;
}

export function GetLabels(label) {
	const labels = { 
		users: {
			suggestionsHeaderText: 'Suggested users', 
			noResultsFoundText: 'No users found' 
		},
		clusters: {
			suggestionsHeaderText: 'Suggested clusters', 
			noResultsFoundText: 'No clusters found' 
		}
	};

	return labels[label];
}

export function SetTagsValues(tags, field, setSettingsValue, self) {
	if (tags) {
		const results = [];

		tags.forEach((tag) => {
			results.push(tag.key);
		});

		if (setSettingsValue) {
			setSettingsValue({ results }, field, self);
		}
	}
}

export function GetSiteGroupId(groupName, self) {
	$.ajax({
		url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/sitegroups/getbyname('${groupName}')?$select=Id`,
		type: 'GET',
		contentType: 'application/json;odata=verbose',
		headers: {
			Accept: 'application/json;odata=verbose'
		},
		success: (data) => {
			const id = (data && data.d && data.d.Id ? data.d.Id : null);

			if (id) {
				self.setState({ [groupName]: id });
			}                            
		}
	}); 
}

function assignPermissionsToUser(listName, projectId, userId, role, type) {
	const dfd = $.Deferred(() => {
		$.ajax({  
			url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getByTitle('${listName}')/getItemById(${projectId})/roleassignments/${type}roleassignment (principalid=${userId}, roleDefId=${role})`,  
			type: 'POST',  
			headers: {  
				Accept: 'application/json;odata=verbose',  
				'content-Type': 'application/json;odata=verbose',  
				'X-RequestDigest': $('#__REQUESTDIGEST').val()  
			},  
			dataType: 'json',
			success: () => {  
				dfd.resolve();
			},  
			error: (error) => {  
				console.log(JSON.stringify(error));  
			}  
		}); 
	});

	return dfd.promise(); 
}

export function AssignPermissionsToUsers(listName, projectId, usersRoles, roles, callback, self, type) {
	const promises = [];           
	const userGroups = Object.keys(usersRoles);

	if (userGroups.length > 0) {
		userGroups.forEach((userGroup) => {
			const userIds = usersRoles[userGroup].users;
			const role = roles[usersRoles[userGroup].roles];

			console.log(`User group: ${userGroup} role: ${role} users: ${userIds}`);

			if (userIds && userIds.length > 0) {
				userIds.forEach((userId) => {
					console.log(`User: ${userId}`);

					if (userId) {
						promises.push(assignPermissionsToUser(listName, projectId, userId, role, type || 'add'));
					}
				});
			}
		});
	}

	$.when(...promises).then(callback.bind(null, self));
}