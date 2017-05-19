import { DOCUMENTSLIBRARY } from '../../utils/settings';

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
	loadingMessage: ''
};
