/* External libraries */
import React from 'react';
import Moment from 'moment';

/* Components */
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { DAYPICKERSTRINGS } from '../../../../utils/settings';

/* CSS styles */
import Styles from './FormDatePicker.scss';

class FormDatePicker extends React.Component {
	static propTypes = {
		label: React.PropTypes.string,
		field: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		onSelectDate: React.PropTypes.func,
		item: React.PropTypes.objectOf(React.PropTypes.any)
	};

	constructor() {
		super();
		this.state = {
			value: ''
		};
		this.handleDatePickerSelect = this.handleDatePickerSelect.bind(this);
		this.formatDate = this.formatDate.bind(this);
	}

	componentDidMount() {
		this.setValue(this.props.item);
	}

	componentWillReceiveProps(nextProps) {        	
		this.setValue(nextProps.item);
	}

	setValue(item) {
		if (item && item[this.props.field]) {
			this.setState({ value: new Date(item[this.props.field]) });
		} else {
			this.setState({ value: new Date() });
		}
	}

	handleDatePickerSelect(value) {
		this.props.onSelectDate(value, this.props.field);
	}

	formatDate(date) {
		return date ? Moment(date).format('DD/MM/YYYY') : '';
	}

	render() {
		return (
			<div className={`${Styles.container} ms-Grid-row`}>
				<div className={`${Styles.info_label} ms-Grid-col ms-u-md6 ms-u-sm12`}>
					{this.props.label}:
				</div>
				<div className={`${Styles.info_value} ms-Grid-col ms-u-md6 ms-u-sm12`}>
					<DatePicker strings={DAYPICKERSTRINGS} placeholder={this.props.placeholder} value={this.state.value}
									onSelectDate={this.handleDatePickerSelect} formatDate={this.formatDate} />
				</div>
			</div>
		);
	}
}

export default FormDatePicker;
