/* External libraries */
import React from 'react';

/* Components */
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import TableView from '../TableView/TableView';
import { DOCUMENTSLIBRARY } from '../../../utils/settings';

/* CSS styles */
import Styles from './PivotView.scss';

class PivotView extends React.Component {
	static propTypes = {
		excel: React.PropTypes.objectOf(React.PropTypes.any),
		xmlFileNames: React.PropTypes.objectOf(React.PropTypes.string)
	};

	constructor(props) {
		super(props);

		this.state = {
			excel: props.excel
		};
	}

	componentWillReceiveProps(nextProps) {        
		this.setState({ 
			excel: nextProps.excel
		});
	}

	render() {
		const self = this;
		const filePath = `${_spPageContextInfo.webServerRelativeUrl}/${DOCUMENTSLIBRARY}/`;

		return (
			<Pivot linkSize={PivotLinkSize.large}>
				<PivotItem linkText="Lists">
					{
						self.state.excel.lists && self.state.excel.lists.length > 0 ? 
						(
							<TableView data={self.state.excel.lists} 
										xmlFilePath={`${filePath}${self.props.xmlFileNames.lists}`}
										columns={['Name', 'Type', 'Comments']} 
										title="Lists table" />
						) 
						:
						(
							<div className={Styles.upload_message}>
								Upload an Excel file to see lists definition
							</div>
						)
					}
				</PivotItem>
				<PivotItem linkText="Fields">
					{
						self.state.excel.fields && self.state.excel.fields.length > 0 ? 
						(
							<TableView data={self.state.excel.fields} 
										xmlFilePath={`${filePath}${self.props.xmlFileNames.fields}`}
										columns={['Name', 'Type', 'Values', 'Options']} 
										title="Fields table" />
						) 
						:
						(
							<div className={Styles.upload_message}>
								Upload an Excel file to see fields definition
							</div>
						)
					}
				</PivotItem>
				<PivotItem linkText="Content Types">
					{
						self.state.excel.contentTypes && self.state.excel.contentTypes.length > 0 ? 
						(
							<TableView data={self.state.excel.contentTypes} 
										xmlFilePath={`${filePath}${self.props.xmlFileNames.contentTypes}`}
										columns={['Name', 'Parent Type']} 
										title="Content Types table" />
						) 
						:
						(
							<div className={Styles.upload_message}>
								Upload an Excel file to see content types definition
							</div>
						)
					}
				</PivotItem>
				<PivotItem linkText="Groups">
					{
						self.state.excel.groups && self.state.excel.groups.length > 0 ? 
						(
							<TableView data={self.state.excel.groups} 
										xmlFilePath={`${filePath}${self.props.xmlFileNames.groups}`}
										columns={['Name', 'Permission Level', 'Comments']} 
										title="Groups table" />
						) 
						:
						(
							<div className={Styles.upload_message}>
								Upload an Excel file to see groups definition
							</div>
						)
					}
				</PivotItem>
			</Pivot>
		);
	}
}

export default PivotView;