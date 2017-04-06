/* External libraries */
import React from 'react';

/* Components */
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

/* CSS styles */
import Styles from './SettingsView.scss';

class SettingsView extends React.Component {
	static propTypes = {
		title: React.PropTypes.string
	};

	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			showPanel: false
		};

		this.handleOnClosePanel = this.handleOnClosePanel.bind(this);
		this.handleOnShowPanel = this.handleOnShowPanel.bind(this);
		this.handleOnRenderFooterContent = this.handleOnRenderFooterContent.bind(this);
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			title: nextProps.title
		});
	}

	handleOnClosePanel() {
		this.setState({ showPanel: false });
	}

	handleOnShowPanel() {
		this.setState({ showPanel: true });
	}

	handleOnRenderFooterContent() {
		return (
			<div>
				Footer
			</div>
		);
	}

	render() {
		const self = this;

		const mainContent = (
			<div className={Styles.content}>
				<div className="button cancel" onClick={self.handleOnClosePanel}>
					Cancel
				</div>
			</div>
		);

		return (
			<div className={Styles.container}>
				<div className="button" onClick={self.handleOnShowPanel}>
					Open settings
				</div>
				<Panel headerText="Settings" 
						hasCloseButton={false}
						type={PanelType.medium}
						isOpen={self.state.showPanel}
						onDismiss={self.handleOnClosePanel}
						onRenderFooterContent={self.handleOnRenderFooterContent}>
					{mainContent}
				</Panel>
			</div>
		);
	}
}

export default SettingsView;