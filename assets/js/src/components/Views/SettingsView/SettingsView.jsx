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
	}

	private onClosePanel = () => {
		this.setState({ showPanel: false });
	}

	private onShowPanel = () => {
		this.setState({ showPanel: true });
	};

	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			showPanel: false
		};
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			title: nextProps.title
		});
	}

	render() {
		const self = this;

		return (
			<div>
				<div className={Styles.buttons_container}>
					<div className="button" onClick={self.onShowPanel}>
						Open settings
					</div>
				</div>
				<Panel isOpen={self.state.showPanel}
						type={PanelType.smallFixedFar}
						onDismiss={self.onClosePanel}
						headerText="Settings"
						onRenderFooterContent={ () => {
							return (
								<div>
									Footer
								</div>
							);
						}}>
						Content
				</Panel>
			</div>
		);
	}
}

export default SettingsView;