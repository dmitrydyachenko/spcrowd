/* External libraries */
import React from 'react';
import SPOC from 'SPOCExt';
import $ from 'jquery';

/* Components */
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { CASTLIST } from '../../../../utils/settings';

/* CSS styles */
import Styles from './FormDropDownField.scss';

class FormDropDownField extends React.Component {
	static propTypes = {
		label: React.PropTypes.string,
		listName: React.PropTypes.string,
		values: React.PropTypes.arrayOf(React.PropTypes.object),
		field: React.PropTypes.string,
		sourceList: React.PropTypes.string, 
		item: React.PropTypes.objectOf(React.PropTypes.any),
		filter: React.PropTypes.string, 
		order: React.PropTypes.string,
		onChanged: React.PropTypes.func
	};

	static defaultProps = {	
		listName: CASTLIST,
		order: 'ItemOrder asc'
	};

	constructor() {
		super();
		this.state = {
			options: [],
			fieldType: ''
		};
		this._isMounted = false;
		this.site = new SPOC.SP.Site();
		this.handleDropDownChange = this.handleDropDownChange.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		if (this.props.values && this.props.values.length > 0) {
			this.getStaticValues(this.props.values);
		} else if (this.props.sourceList) {
			this.getFieldValuesFromList(this.props.sourceList);
		} else if (this.props.field) {
			this.getFieldValues(this.props.field);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getFieldValuesFromList(sourceList) {
		const self = this;
		const settings = {
			select: 'Id, Title',
			filter: self.props.filter || '',
			orderBy: self.props.order
		};

		self.site.ListItems(sourceList).query(settings).then((results) => {
			if (results && results.length > 0 && self._isMounted) {
				const options = [];

				for (let i = 0; i < results.length; i++) {	
					let selectedKey = false;

					if (self.props.item && self.props.item[self.props.field].Title === results[i].Title) {
						selectedKey = true;
					} 

					options.push({ key: i, text: results[i].Title, selectedKey, Id: results[i].Id });
				}

				self.setState({ options, fieldType: 'Lookup' });
			}	
		});
	}

	getFieldValues(field) {
		const self = this;
		const filterString = `$select=TypeAsString,Choices,TermSetId&$filter=InternalName eq '${field}'`;

		$.ajax({
			url: `${self.site.url}/_api/web/lists/getbytitle('${self.props.listName}')/Fields?${filterString}`,
			type: 'GET',
			contentType: 'application/json;odata=verbose',
			headers: {
				Accept: 'application/json;odata=verbose'
			},
			success: (results) => {
				let options = [];

				const data = results && results.d && results.d.results.length > 0 ? results.d.results[0] : null;

				if (data) { 
					const fieldType = data.TypeAsString;

					let selectedKeyId = -1;
					
					if ((fieldType === 'Choice' || fieldType === 'MultiChoice') && data.Choices) {
						const choicesResults = data.Choices.results;

						if (choicesResults.length > 0) {
							for (let i = 0; i < choicesResults.length; i++) {
								let selectedKey = false;

								if (self.props.item) {
									if ((fieldType === 'MultiChoice' && self.props.item[field] && 
										self.props.item[field].results && self.props.item[field].results.length > 0 && 
										self.props.item[field].results[0] === choicesResults[i]) || 
										(self.props.item[field] === choicesResults[i])) {
										selectedKey = true;
										selectedKeyId = i;
									} 
								}

								options.push({ key: i, text: choicesResults[i], selectedKey });
							}
						}
					} else if (fieldType === 'Boolean') {
						const selectedKey = (self.props.item && self.props.item[field] === true);

						options = [
							{ key: 0, text: 'Yes', selectedKey }, 
							{ key: 1, text: 'No', selectedKey: !selectedKey }
						];

						selectedKeyId = selectedKey ? 0 : 1;
					} else if (fieldType === 'TaxonomyFieldType' || fieldType === 'TaxonomyFieldTypeMulti') {
						this.getTermsFromTaxonomyStore(data.TermSetId, field, fieldType);
					} 

					if (fieldType === 'Choice' || fieldType === 'MultiChoice' || fieldType === 'Boolean') {
						self.setState({ options, fieldType }, () => {
							if (self.props.item && self.props.item[field]) {
								self.props.onChanged({ 
									key: selectedKeyId, 
									text: (fieldType === 'MultiChoice' && self.props.item[field].results.length > 0 ? 
											self.props.item[field].results[0] : self.props.item[field]) 
								}, field, fieldType);
							}
						});
					}
				}
			}
		});           
	}

	getTermsFromTaxonomyStore(termSetId, field, fieldType) {
		const self = this;
		const context = SP.ClientContext.get_current();            
		const taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
		const termStore = taxSession.getDefaultSiteCollectionTermStore();
		const termSet = termStore.getTermSet(termSetId);
		const terms = termSet.get_terms();

		context.load(terms);

		context.executeQueryAsync(() => {
			const termEnumerator = terms.getEnumerator();
			const options = [];

			let selectedKeyId = -1;

			while (termEnumerator.moveNext()) {
				const currentTerm = termEnumerator.get_current();
				const text = currentTerm.get_name();
				const key = currentTerm.get_id()._m_guidString$p$0;

				let selectedKey = false;

				if (self.props.item && self.props.item[field] && 
					self.props.item[field].results && self.props.item[field].results.length > 0 &&
					self.props.item[field].results[0].Label === text) {
					selectedKey = true;
					selectedKeyId = key;
				} 

				options.push({ key, text, selectedKey });
			}

			self.setState({ options, fieldType }, () => {
				if (self.props.item && self.props.item[field]) {
					self.props.onChanged({ 
						key: selectedKeyId, 
						text: self.props.item[field].results[0].Label
					}, field, fieldType);
				}
			});
		},
		(sender, args) => {
			console.log(args.get_message());
		});
	}

	getStaticValues(options) {
		this.setState({ options, field: this.props.field, fieldType: 'Static' });
	}

	handleDropDownChange(selectedObject) {
		const selected = selectedObject;

		selected.selectedKey = true;

		if (this.props.onChanged) {
			this.props.onChanged(selected, this.props.field, this.state.fieldType);	
		}
	}

	render() {
		const show = this.state.options && this.state.options.length > 0;

		let selectedKey = show ? this.state.options.filter(x => x.selectedKey === true) : null;

		if (selectedKey && selectedKey.length > 0) {
			selectedKey = selectedKey[0].key;
		}

		return (
			<div className={`${Styles.container} ms-Grid-row`}>
				<div className={`${Styles.info_label} ms-Grid-col ms-u-md6 ms-u-sm12`}>
					{this.props.label}:
				</div>
				<div className={`${Styles.info_value} ms-Grid-col ms-u-md6 ms-u-sm12`}>
					{
						show ? 
						(
							<Dropdown options={this.state.options} selectedKey={selectedKey}
										onChanged={this.handleDropDownChange} />
						) : null
					}
				</div>
			</div>
		);
	}
}

export default FormDropDownField;
