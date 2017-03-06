/* External libraries */
import React from 'react';

/* Components */
import TextFieldComponent from '../../TextFieldComponent/TextFieldComponent';

/* CSS styles */
import Styles from './FormTextField.scss';

class FormTextField extends React.Component {
	static propTypes = {
		label: React.PropTypes.string.isRequired,
		field: React.PropTypes.string.isRequired,
		placeholder: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onGetErrorMessage: React.PropTypes.func,
		item: React.PropTypes.objectOf(React.PropTypes.any),
		required: React.PropTypes.bool,
		customClass: React.PropTypes.string,
		errorMessage: React.PropTypes.string
	};

	static defaultProps = {	
		errorMessage: 'Mandatory field'  
	};

	constructor() {
		super();
		this.state = {
			value: '',
			errorClass: ''
		};
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.getErrorMessage = this.getErrorMessage.bind(this);
		this.validate = this.validate.bind(this);
	}

	componentDidMount() {
		this.setValue(this.props.item);
	}

	componentWillReceiveProps(nextProps) {        	
		this.setValue(nextProps.item);
	}

	setValue(item) {
		if (item) {
			this.setState({ value: item[this.props.field] || '' });
		}
	}

	validate() {
		if (this.props.required && !this.state.value) {
			this.setState({ errorClass: Styles.error });
			return false;
		}

		this.setState({ errorClass: '' });
		return true;
	}

	getErrorMessage(value) {
		return this.props.onGetErrorMessage ? this.props.onGetErrorMessage(value) : '';
	}

	handleTextboxChange(value) {
		this.setState({ value, errorClass: '' }, () => {
			this.props.onChange(value, this.props.field);
		});
	}

	render() {
		const labelContent = this.props.required ? <span style={{ color: 'red' }}>*</span> : null;

		const errorContent = this.state.errorClass ? 
		(
			<div className={Styles.error_block}>
				{this.props.errorMessage}
			</div>
		) : null;

		const mainClass = this.props.customClass || 'ms-Grid-col ms-u-md6 ms-u-sm12';

		return (
			<div className={`${Styles.container} ms-Grid-row`}>
				<div className={`${Styles.info_label} ${mainClass}`}>
					{this.props.label}
					{labelContent}:
				</div>
				<div className={`${Styles.info_value} ${mainClass}`}>
					<TextFieldComponent placeholder={this.props.placeholder} 
										onChange={this.handleTextboxChange} 
										value={this.state.value} className={this.state.errorClass}
										onGetErrorMessage={this.getErrorMessage} />
					{errorContent}
				</div>
			</div>
		);
	}
}

export default FormTextField;
