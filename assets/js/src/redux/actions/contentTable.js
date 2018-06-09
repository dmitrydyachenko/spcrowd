export function setSource(source) {
	return { type: 'SET_SOURCE', source };
}

export function setListName(listName) {
	return { type: 'SET_LIST_NAME', listName };
}

export function setPrefixName(prefixName) {
	return { type: 'SET_PREFIX_NAME', prefixName };
}

export function setGroupName(groupName) {
	return { type: 'SET_GROUP_NAME', groupName };
}

export function setContentTypesPrefix(use) {
	return { type: 'SET_CONTENT_TYPES_PREFIX', use };
}

export function setListsPrefix(use) {
	return { type: 'SET_LISTS_PREFIX', use };
}