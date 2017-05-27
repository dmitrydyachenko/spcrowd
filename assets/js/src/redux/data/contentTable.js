import { DOCUMENTSLIBRARY, NAMESPACES } from '../../utils/settings';

export default {
	excel: {
		fields: [],
		lists: [],
		contentTypes: [],
		groups: [],
		path: '',
		loading: false
	},
	xml: {
		fields: [],
		lists: [],
		contentTypes: [],
		groups: [],
		loading: true
	},
	source: { 
		value: '', 
		files: [] 
	},
	listName: DOCUMENTSLIBRARY,
	groupName: NAMESPACES.group,
	prefixName: NAMESPACES.prefix,
	useContentTypePrefix: false,
	useListPrefix: false,
	loadingMessage: ''
};
