/* External libraries */
import Data2xml from 'data2xml';

/* Components */
import { ToCamelCase } from '../../../utils/utils';

export function GetFieldsXml(data, namespaces) {
	const convert = Data2xml({ xmlDecl: false });
	const formattedData = [];

	for (let i = 0; i < data.length; i++) {
		const type = data[i].Type;
		const lowerCaseType = type.toLowerCase().replace(/\s+/g, '');

		const _attr = { 
			Name: `${namespaces.prefix}${ToCamelCase(data[i].Name)}`, 
			DisplayName: data[i].Name, 
			Type: type
		};

		let constraints = data[i].Constraints;

		let field = {};

		switch (lowerCaseType) {
			case 'text': 
				field = { _attr };
				break;
			case 'boolean': 
				field = { _attr, Default: constraints && constraints === 'Yes' ? 1 : 0 };
				break;
			case 'checkbox': 
			case 'dropdown': 
				_attr.Type = lowerCaseType === 'checkbox' ? 'MultiChoice' : 'Choice';

				field = { _attr };

				if (constraints) {
					if (constraints.indexOf('PATH:') > -1) {
						constraints = constraints.split('PATH:');

						if (constraints.length > 1) {
							field = { 
								_attr, 
								CHOICES: {
									ExternalValues: { 
										_attr: { 
											Path: constraints[1].trim() 
										} 
									} 
								}
							}; 
						}
					} else {
						constraints = constraints.split(',');

						if (constraints.length > 0) {
							const constraintsObject = [];

							for (let j = 0; j < constraints.length; j++) {
								constraintsObject.push({ _value: constraints[j].trim() });
							}

							field = { _attr, CHOICES: { CHOICE: constraintsObject } }; 
						}
					}
				}
				break;
			case 'multiplelinesoftext': 
				_attr.NumLines = '6';
				_attr.RichText = 'TRUE';
				_attr.RichTextMode = 'FullHtml';

				if (constraints) {
					constraints = constraints.split(',');

					switch (constraints.length) {
						case 3:
							_attr.RichTextMode = constraints[2].trim();
						case 2:
							_attr.RichText = constraints[1].toLowerCase().replace(/\s+/g, '') === 'richtext' ? 
												'TRUE' : 'FALSE';
						case 1:
							_attr.NumLines = constraints[0].trim();
							break;
						default: 
							break;
					}
				} 

				_attr.Type = 'Note';

				field = { _attr };
				break;
			case 'hyperlinkorpicture':
				_attr.Format = 'URL';

				if (constraints) {
					const lowerCaseConstraints = constraints.toLowerCase().replace(/\s+/g, '');

					if (lowerCaseConstraints === 'hyperlink') {
						_attr.Format = 'URL';
					} else if (lowerCaseConstraints === 'picture') {
						_attr.Format = 'Image';
					}
				} 

				_attr.Type = 'URL';

				field = { _attr };
				break;
			case 'number':
				_attr.Min = '0';

				if (constraints) {
					constraints = constraints.trim();

					if (!isNaN(parseInt(constraints, 10))) {
						_attr.Min = constraints;
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

				if (constraints) {
					switch (constraints.toLowerCase().replace(/\s+/g, '')) {
						case 'peopleandgroups':
							_attr.Type = 'User';
							_attr.Mult = 'FALSE';
							_attr.UserSelectionMode = 'PeopleAndGroups';
							break;
						case 'peopleandgroupsmulti':
							_attr.Type = 'UserMulti';
							_attr.Mult = 'TRUE';
							_attr.UserSelectionMode = 'PeopleAndGroups';
							break;
						case 'peopleonly':
							_attr.Type = 'User';
							_attr.Mult = 'FALSE';
							_attr.UserSelectionMode = 'PeopleOnly';
							break;
						default: 
							break;
					}
				}

				field = { _attr };
				break;
			case 'taxonomy':
				_attr.Type = 'Taxonomy';

				field = { _attr };

				if (constraints) {
					constraints = constraints.split(',');

					if (constraints.length > 0) {
						switch (constraints.length) {
							case 2:
								field._attr.TermSet = constraints[1].trim();
							case 1:
								field._attr.Mult = constraints[0].toLowerCase().trim() === 'true' ? 'TRUE' : 'FALSE';
								break;
							default: 
								const constraintsObject = [];

								for (let j = 2; j < constraints.length; j++) {
									constraintsObject.push({ _attr: { Name: constraints[j].trim() } });
								}

								field._attr.TermSet = constraints[1].trim();
								field._attr.Mult = constraints[0].toLowerCase().trim() === 'true' ? 'TRUE' : 'FALSE';
								field.GroupsToTest = { Group: constraintsObject };								
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