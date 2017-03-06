/* External libraries */
import React from 'react';
import { Button } from 'office-ui-fabric-react/lib/Button';

/* CSS styles */
import Styles from './Button.scss';

class ButtonComponent extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		value: React.PropTypes.string,
		href: React.PropTypes.string,
		onClick: React.PropTypes.func
	};

	constructor() {
		super();
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnClick(e) {
		if (this.props.onClick) {
			this.props.onClick();
			e.preventDefault();
		}
	}

	render() {
		return (
			<div className={this.props.className}>
				<Button data-automation-id="button" 
						className={Styles.button} 
						href={this.props.href}
						onClick={this.handleOnClick}>{this.props.value}</Button>
			</div>
		);
	}
}

export default ButtonComponent;