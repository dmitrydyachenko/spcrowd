/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';

/* Components */
import SearchCasts from '../../components/SearchCasts/SearchCasts';

class AllCast extends React.Component {
	constructor() {
		super();
		this.state = {
			searchKeyWord: '',
			filters: {}
		};
		this.filterQueryKeyWord = '';
		this.filterQueryFilters = {};
	}

	componentDidMount() {
		const storageAvailable = SPOC.Utils.Storage.storageAvailable();

		this.filterQueryKeyWord = '';
		this.filterQueryFilters = {};

		if (storageAvailable) {
			this.filterQueryKeyWord = SPOC.Utils.Storage.get(`FilterQueryKeyWord_${_spPageContextInfo.userId}`);
			this.filterQueryFilters = SPOC.Utils.Storage.get(`FilterQueryFilters_${_spPageContextInfo.userId}`);

			SPOC.Utils.Storage.remove(`FilterQueryKeyWord_${_spPageContextInfo.userId}`);
			SPOC.Utils.Storage.remove(`FilterQueryFilters_${_spPageContextInfo.userId}`);
		} else {
			console.log('Storage is not available');
		}

		this.setState({
			searchKeyWord: this.filterQueryKeyWord && this.filterQueryKeyWord.searchKeyWord ? this.filterQueryKeyWord.searchKeyWord : '',
			filters: this.filterQueryFilters || {}
		});
	}

	render() {
		return <SearchCasts searchKeyWord={this.state.searchKeyWord} filters={this.state.filters} showResults />;
	}
}

export default AllCast;