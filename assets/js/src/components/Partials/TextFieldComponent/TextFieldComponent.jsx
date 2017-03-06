import React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

class TextFieldComponent extends React.Component {
	static propTypes = {
		label: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onGetErrorMessage: React.PropTypes.func,
		value: React.PropTypes.string
	};

	constructor() {
		super();
		this.state = {
			value: ''
		};
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.getErrorMessage = this.getErrorMessage.bind(this);
	}

	componentDidMount() {
		this.setValue(this.props.value);
	}

	componentWillReceiveProps(nextProps) {        	
		this.setValue(nextProps.value);
	}

	setValue(value) {
		this.setState({ value });
	}

	getErrorMessage(value) {
		return this.props.onGetErrorMessage ? this.props.onGetErrorMessage(value) : '';
	}

	handleTextboxChange(value) {
		this.setState({ value }, () => {
			this.props.onChange(value);
		});
	}

	render() {
		return (
			<div className={this.props.className}>
				<TextField label={this.props.label} 
							placeholder={this.props.placeholder} 
							onChanged={this.handleTextboxChange} 
							value={this.state.value}
							onGetErrorMessage={this.getErrorMessage} />
			</div>
		);
	}
}

export default TextFieldComponent;
