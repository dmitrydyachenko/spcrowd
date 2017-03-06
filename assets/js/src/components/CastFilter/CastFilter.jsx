/* External libraries */
import $ from 'jquery';
import React from 'react';
import SPOC from 'SPOCExt';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import CamlBuilder from '../../../vendor/camljs';

/* Components */
import { CASTLIST } from '../../utils/settings';
import { CompareByTitle, SelectSrcValue, MergeObjects } from '../../utils/utils';

/* CSS styles */
import Styles from './CastFilter.scss';

class CastFilter extends React.Component {
	static propTypes = {
		fieldName: React.PropTypes.string.isRequired,
		listName: React.PropTypes.string,
		title: React.PropTypes.string,
		onChange: React.PropTypes.func,
		sourceList: React.PropTypes.string,
		values: React.PropTypes.objectOf(React.PropTypes.any),
		onFilterPanelClick: React.PropTypes.func,
		displayFilterPanel: React.PropTypes.bool
	};

	static defaultProps = {	
		listName: CASTLIST
	};	

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			values: {},
			filterUsed: false
		};
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handleIconCheckboxChange = this.handleIconCheckboxChange.bind(this);
		this.handleFilterPanelClick = this.handleFilterPanelClick.bind(this);
	}

	componentDidMount() {
		this.setState({ [`display_${this.props.fieldName}_filter`]: this.props.displayFilterPanel });

		if (this.props.sourceList) {
			this.getValues(this.props.sourceList);
		} else {
			this.getFields();
		}
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ [`display_${this.props.fieldName}_filter`]: nextProps.displayFilterPanel });
	}

	handleCheckboxChange(e, isChecked) {
		const target = e.target;
		const name = target.attributes.getNamedItem('data-name').nodeValue;
		const value = target.attributes.getNamedItem('data-value').nodeValue;
		const type = target.attributes.getNamedItem('data-type').nodeValue;

		this.setState({ values: MergeObjects(this.state.values, { [value]: isChecked }) }, () => {
			const keys = Object.keys(this.state.values);

			for (let i = 0; i < keys.length; i++) {
				if (this.state.values[keys[i]] === true) {
					this.setState({ filterUsed: true });
					break;
				}

				this.setState({ filterUsed: false });
			}

			this.props.onChange(name, value, isChecked, type);
		});
	}

	handleIconCheckboxChange(e) {
		const target = e.target;
		const name = target.attributes.getNamedItem('data-name').nodeValue;
		const value = target.attributes.getNamedItem('data-value').nodeValue;

		this.setState({ [name]: MergeObjects(this.state[name], { [value]: !this.state[name][value] }) }, () => {
			const keys = Object.keys(this.state[name]);

			for (let i = 0; i < keys.length; i++) {
				if (this.state[name][keys[i]] === true) {
					this.setState({ filterUsed: true });
					break;
				} 

				this.setState({ filterUsed: false });
			}

			this.props.onChange(name, value, this.state[name][value]);
		});
	}

	handleFilterPanelClick() {
		if (this.props.onFilterPanelClick) {
			this.props.onFilterPanelClick(`display_${this.props.fieldName}_filter`);
		}
	}

	getValues(sourceList) {
		const self = this;
		const caml = new CamlBuilder()
                        .View(['ID', 'Title', 'PublishingPageImage'])
                        .Query()
                        .ToString();

		(new SPOC.SP.Site()).ListItems(sourceList).queryCSOM(caml).then((results) => {
			if (results && results.length > 0) {
				const data = [{ 
					title: sourceList,
					name: self.props.fieldName,
					type: 'Lookup',
					values: [],
					icons: []
				}];				

				for (let i = 0; i < results.length; i++) {
					data[0].icons.push(SelectSrcValue(results[i].PublishingPageImage));
					data[0].values.push(results[i].Title);
				}

				self.setState({ data, [self.props.fieldName]: self.props.values || {} });
			}	
		});
	}

	getFields() {
		const self = this;

		$.ajax({
			url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getbytitle('${self.props.listName}')/Fields?$select=Title,InternalName,TypeAsString,Choices&$filter=InternalName eq '${self.props.fieldName}'`,
			type: 'GET',
			contentType: 'application/json;odata=verbose',
			headers: {
				Accept: 'application/json;odata=verbose'
			},
			success: (fields) => {
				const results = (fields && fields.d ? fields.d.results : null);

				if (results && results.length > 0) {
					const value = results[0];
					const data = [{
						title: value.Title, 
						name: value.InternalName,
						type: value.TypeAsString,
						values: value.TypeAsString === 'Boolean' ? ['Yes', 'No'] : value.Choices.results
					}];

					self.setState({ data: data.sort(CompareByTitle), values: self.props.values || {} });
				}
			}
		});
	}

	render() {
		const data = this.state.data;
		const show = data && data.length > 0;
		const filter = show ? data[0] : null;

		const mainContent = filter && filter.values.length > 0 ? filter.values.map((value, i) => {
			let isChecked = false;
			let filterContent = null;

			if (this.props.sourceList) {
				isChecked = (this.state[filter.name][value] === undefined ? false : this.state[filter.name][value]);

				filterContent = value !== 'sourceList' ? 
				(
					<div className={`ms-Checkbox ${Styles.checkbox_icon}`}>
						<input type="checkbox" id={`${filter.name}_${value}`} data-name={filter.name} data-value={value} className="ms-Checkbox-input" 
								checked={isChecked} onChange={this.handleIconCheckboxChange} />
						<label htmlFor={`${filter.name}_${value}`} className={`ms-Checkbox-label ${isChecked ? 'is-checked' : ''}`}>
							<div className={Styles.icon}>
								<img src={filter.icons[i]} role="presentation" />
							</div>
							<span className="ms-Label">{value}</span>
						</label>
					</div>
				) : null;
			} else {
				const encodedValue = encodeURIComponent(value);

				const inputProps = {	
					'data-name': filter.name,
					'data-value': encodedValue,
					'data-type': filter.type
				};

				isChecked = this.state.values && this.state.values[encodedValue] && this.state.values[encodedValue] === true;

				filterContent = <Checkbox label={value} inputProps={inputProps} className={Styles.checkbox} checked={isChecked || false} onChange={this.handleCheckboxChange} />;
			}

			return <div key={i}>{filterContent}</div>;
		}) 
		: 
		( 
			<span className={Styles.empty}>
				<h1>No values...</h1>
			</span>
		);

		return (
			<div className={`${Styles.container} ms-Grid-col ms-u-md2 ms-u-sm12`}>
				<div className={`${Styles.filter_top} ${this.state.filterUsed ? Styles.filterUsed : ''}`} onClick={this.handleFilterPanelClick}>
					<div className={Styles.title}>
						{this.props.title || (filter ? filter.title : '')}
					</div>
					<div className={Styles.filter_panel_toggle}>
						<i className={(this.state[`display_${this.props.fieldName}_filter`] ? 'ms-Icon ms-Icon--ChevronUp' : 'ms-Icon ms-Icon--ChevronDown')} aria-hidden="true" />
					</div>
				</div>
				<div className={Styles.filter_panel} style={{ display: (this.state[`display_${this.props.fieldName}_filter`] ? 'block' : 'none') }}>
					{mainContent}
				</div>
			</div>
		);
	}
}

export default CastFilter;