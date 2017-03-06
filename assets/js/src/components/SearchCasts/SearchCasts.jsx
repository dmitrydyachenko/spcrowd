/* External libraries */
import React from 'react';

/* Components */
import CastFilter from '../../components/CastFilter/CastFilter';
import TextFieldComponent from '../../components/Partials/TextFieldComponent/TextFieldComponent';
import Button from '../../components/Partials/Button/Button';
import CastThumbnail from '../../components/CastThumbnail/CastThumbnail';
import { CASTLIST } from '../../utils/settings';
import { GetEqNeqOrAndFilter, JoinQuery, MergeObjects, GetSubStringOfFilter } from '../../utils/utils';

/* CSS styles */
import Styles from './SearchCasts.scss';

class SearchCasts extends React.Component {
	static propTypes = {
		listName: React.PropTypes.string,
		showResults: React.PropTypes.bool,
		onSearch: React.PropTypes.func,
		filters: React.PropTypes.objectOf(React.PropTypes.any),
		searchKeyWord: React.PropTypes.string,
		onFetchData: React.PropTypes.func
	};

	static defaultProps = {	
		listName: CASTLIST,
		filters: {},
		searchKeyWord: ''			
	};	

	constructor() {
		super();
		this.state = {
			filterQuery: ''
		};
		this.filters = {
			AgeGroup: {}, 
			CastLocation: {}, 
			HairType: {}, 
			HairColour: {
				sourceList: 'Hair Colour'
			},
			HairLength: {}, 
			SkinCondition: {},
			SkinTone: {
				sourceList: 'Skin Tone'
			},
			DeoUnderarmCondition: {},
			Children: {}, 
			CastTypes: {}
		};
		this.searchFilters = [
			'Title',
			'CastName', 
			'CastOccupation', 
			'HairColour/Title', 
			'SkinTone/Title', 
			'YearOfBirth', 
			'LocationOfResidence',
			'CastingAgencyContact',
			'CastTypes',
			'SuitabilityVideoPhoto',
			'CastCitizenship',
			'FirstLanguage',
			'CastPassport',
			'AgeGroup',
			'CastLocation',
			'HeightCm',
			'HairType',
			'HairLength',
			'SkinCondition',
			'DeoUnderarmCondition'
		];
		this.searchKeyWord = '';
		this.selectFields = 'Id, CastName, ProfilePhoto, HairColour/Title, SkinTone/Title';
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handleSearchCastsClick = this.handleSearchCastsClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleFilterPanelClick = this.handleFilterPanelClick.bind(this);
		this.handleFetchData = this.handleFetchData.bind(this);
	}

	componentDidMount() {
		this.getItems(this.props.filters, this.props.searchKeyWord);
	}

	componentWillReceiveProps(nextProps) {        
		this.getItems(nextProps.filters, nextProps.searchKeyWord);
	}

	getItems(filters, searchKeyWord) {
		this.filters = (filters && Object.keys(filters).length > 0 ? filters : this.filters);
		this.searchKeyWord = searchKeyWord;
		this.setFilterQuery();
	}

	handleFetchData() {
		if (this.props.onFetchData) {
			this.props.onFetchData();
		}
	}

	handleTextboxChange(value) {
		this.searchKeyWord = value;
		this.setFilterQuery();
	}

	handleCheckboxChange(fieldName, fieldValue, isChecked, fieldType) {
		const values = {};
		values[fieldValue] = isChecked;

		this.filters[fieldName] = MergeObjects(this.filters[fieldName], values);

		if (fieldType) {
			this.filters[fieldName] = MergeObjects(this.filters[fieldName], { type: fieldType });
		}

		this.setFilterQuery();
	}

	handleSearchCastsClick() {
		this.setFilterQuery();

		if (this.props.onSearch) {
			this.props.onSearch(this.filters, this.searchKeyWord);
		}
	}

	handleKeyPress(e) {
		if (e.which === 13) {
			e.preventDefault();
			
			this.setFilterQuery();

			if (this.props.onSearch) {
				this.props.onSearch(this.filters, this.searchKeyWord);
			}
		}
	}

	handleFilterPanelClick(title) {
		this.setState({ [title]: !this.state[title] });
	}

	setFilterQuery() {
		const filterQuery = JoinQuery(this.getQuery(this.filters), 
			this.searchKeyWord ? GetSubStringOfFilter(this.searchKeyWord, this.searchFilters) : '', 'and');

		this.setState({ filterQuery });
	}

	getQuery(filters) {
		let filterQuery = '';

		Object.keys(filters).forEach((filter) => {
			const currentFilter = filters[filter];
			const fields = Object.keys(currentFilter);

			if (fields.length > 0) {
				const type = Object.prototype.hasOwnProperty.call(currentFilter, 'type');
				const isLookUp = Object.prototype.hasOwnProperty.call(currentFilter, 'sourceList');
				const isBoolean = (type && currentFilter.type === 'Boolean');

				let fieldQuery = '';

				fields.forEach((field) => {
					if (field !== 'sourceList' && field !== 'type' && currentFilter[field]) {
						fieldQuery = JoinQuery(fieldQuery, 
							GetEqNeqOrAndFilter([`${filter}${isLookUp ? '/Title' : ''}`], 
								[isBoolean ? (field === 'Yes' ? 1 : 0) : field]), 'or');
					}
				});

				filterQuery = JoinQuery(filterQuery, fieldQuery, 'and');
			}
		});

		return filterQuery;
	}

	render() {
		const filtersContent = this.filters ? Object.keys(this.filters).map((item, i) => 
			<CastFilter key={i} fieldName={item} onFilterPanelClick={this.handleFilterPanelClick} displayFilterPanel={this.state[`display_${item}_filter`]}
						onChange={this.handleCheckboxChange} sourceList={this.filters[item].sourceList} values={this.filters[item]} />
		) : null;

		const resultsContent = this.props.showResults ? (
			<div className={`${Styles.results_container} ms-Grid-row`}>
				<CastThumbnail title="Search Results" 
								select={this.selectFields} 
								filter={this.state.filterQuery} 
								expand={['HairColour', 'SkinTone']}
								onFetchData={this.handleFetchData} />
			</div>
		) : null;

		return (
			<div className={Styles.container}>
				<div className="ms-Grid">
					<div className={`${Styles.header_container} ms-Grid-row`}>
						<div className="container">
							<div className={`${Styles.header} ms-Grid-col ms-u-sm12`}>
								Search Casts
							</div>
						</div>
					</div>
					<div className={`${Styles.search} ms-Grid-row`} onKeyPress={this.handleKeyPress}>
						<div className="ms-Grid container">
							<div className={`${Styles.search_input_container} ms-Grid-row`}>
								<div className={`${Styles.search_input_area} ms-Grid-col ms-u-sm12`}>	
									<TextFieldComponent placeholder="Keyword" className={Styles.search_input} 
															onChange={this.handleTextboxChange} value={this.searchKeyWord} />
								</div>
							</div>
							<div className="ms-Grid-row">
								<div className={`${Styles.search_filter_title} ms-Grid-col ms-u-sm12`}>
									Filter by:
								</div>
							</div>
							<div className={`${Styles.search_filter_container} ms-Grid-row`}>
								<div className={`${Styles.search_filter_area} ms-Grid-col ms-u-sm12`}>
									{filtersContent}
								</div>
							</div>
							<div className={`${Styles.search_button_container} ms-Grid-row`}>
								<div className={`${Styles.search_button_area} ms-Grid-col ms-u-sm12`}>
									<Button value="Search" className={Styles.search_button} 
												onClick={this.handleSearchCastsClick} />
								</div>
							</div>
							{resultsContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SearchCasts;