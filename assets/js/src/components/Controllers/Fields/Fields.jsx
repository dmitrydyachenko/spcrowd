/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetFieldsXml(data, namespaces) {
	const convert = Data2xml({ xmlDecl: false });
	const formattedData = [];

	for (let i = 0; i < data.length; i++) {
		const name = data[i].Name;
		const type = data[i].Type;
		const options = data[i].Options;

		let values = data[i].Values;

		const lowerCaseType = type ? type.toLowerCase().replace(/\s+/g, '') : '';
		const lowerCaseOptions = options ? options.toLowerCase().replace(/\s+/g, '') : '';

		const _attr = { 
			Name: `${namespaces.prefix}${ToCamelCase(name)}`, 
			DisplayName: name, 
			Type: type
		};

		let field = {};

		switch (lowerCaseType) {
			case 'singlelineoftext': 
				_attr.Type = 'Text';

				field = { _attr };
				break;
			case 'boolean': 
				field = { _attr, Default: lowerCaseOptions && lowerCaseOptions === 'yes' ? 1 : 0 };
				break;
			case 'image': 
				_attr.Type = 'Image';
				_attr.RichText = 'TRUE';
				_attr.RichTextMode = 'FullHtml';

				field = { _attr };
				break;
			case 'checkbox': 
			case 'dropdown': 
				_attr.Type = lowerCaseType === 'checkbox' ? 'MultiChoice' : 'Choice';

				field = { _attr };

				if (values) {
					if (lowerCaseOptions && lowerCaseOptions === '#file#') {
						field = { 
							_attr, 
							CHOICES: {
								ExternalValues: { 
									_attr: { 
										Path: values.trim() 
									} 
								} 
							}
						}; 
					} else {
						values = values.split(',');

						if (values.length > 0) {
							const valuesObject = [];

							for (let j = 0; j < values.length; j++) {
								valuesObject.push({ _value: values[j].trim() });
							}

							field = { _attr, CHOICES: { CHOICE: valuesObject } }; 
						}

						if (options) {
							field.Default = { _value: options.trim() }; 
						}
					}
				}
				break;
			case 'lookup': 
				_attr.Type = 'Lookup';
				_attr.ShowField = 'Title';

				if (values) {
					_attr.List = values;
				}

				if (lowerCaseOptions && lowerCaseOptions === 'multi') {
					_attr.Type = 'LookupMulti';
					_attr.Mult = 'TRUE';
				} 

				field = { _attr };
				break;
			case 'multiplelinesoftext': 
				_attr.RichText = 'FALSE';

				if (lowerCaseOptions && lowerCaseOptions === 'fullhtml') {
					_attr.RichText = 'TRUE';
					_attr.RichTextMode = 'FullHtml';
				} 

				_attr.Type = 'Note';

				field = { _attr };
				break;
			case 'hyperlink':
				_attr.Format = lowerCaseOptions && lowerCaseOptions === 'picture' ? 'Image' : 'URL';
				_attr.Type = 'URL';

				field = { _attr };
				break;
			case 'number':
				_attr.Min = '0';

				if (lowerCaseOptions) {
					const lowerCaseOptionsTrimmed = lowerCaseOptions.trim();

					if (!isNaN(parseInt(lowerCaseOptionsTrimmed, 10))) {
						_attr.Min = lowerCaseOptionsTrimmed;
					}
				} 

				_attr.Type = 'Number';

				field = { _attr };
				break;
			case 'dateandtime': case 'date':
				if (lowerCaseType === 'date') {
					_attr.Format = 'DateOnly';
				}

				_attr.Type = 'DateTime';

				field = { _attr };
				break;
			case 'person':
				_attr.Type = 'UserMulti';
				_attr.Mult = 'TRUE';
				_attr.UserSelectionMode = 'PeopleOnly';

				switch (lowerCaseOptions) {
					case 'peopleandgroups':
						_attr.Type = 'UserMulti';
						_attr.Mult = 'TRUE';
						_attr.UserSelectionMode = 'PeopleAndGroups';
						break;
					case 'persononly':
						_attr.Type = 'User';
						_attr.Mult = 'FALSE';
						_attr.UserSelectionMode = 'PeopleOnly';
						break;
					case 'personandgroup':
						_attr.Type = 'User';
						_attr.Mult = 'FALSE';
						_attr.UserSelectionMode = 'PeopleAndGroups';
						break;
					default: 
						break;
				}

				field = { _attr };
				break;
			case 'taxonomy':
				_attr.Type = 'Taxonomy';

				field = { _attr };

				if (values) {
					values = values.split(',');

					if (values.length > 0) {
						switch (values.length) {
							case 1:
								field._attr.TermSet = values[0].trim();
								field._attr.Mult = lowerCaseOptions && lowerCaseOptions === 'multi' ? 'TRUE' : 'FALSE';
								break;
							default: 
								const valuesObject = [];

								for (let j = 2; j < values.length; j++) {
									valuesObject.push({ _attr: { Name: values[j].trim() } });
								}

								field._attr.TermSet = values[0].trim();
								field._attr.Mult = lowerCaseOptions && lowerCaseOptions === 'multi' ? 'TRUE' : 'FALSE';
								field.GroupsToTest = { Group: valuesObject };								
								break;
						}
					}
				}
				break;
			default: 
				break;
		}

		formattedData.push(field);
	}

	let xml = convert('Field', formattedData);
	xml = `<Fields Group="${namespaces.group}">${xml}</Fields>`;

	console.log(xml);

	return xml;
}