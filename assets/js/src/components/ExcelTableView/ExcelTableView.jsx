/* External libraries */
import $ from 'jquery';
import React from 'react';
import xlsx from 'xlsx';

/* CSS styles */
import { AjaxTransport } from '../../utils/utils';
import Styles from './ExcelTableView.scss';

class ExcelTableView extends React.Component {
	static propTypes = {
		docUrl: React.PropTypes.string.isRequired
	};

	constructor() {
		super();

		this.state = {
			data: []
		};
	}

	componentDidMount() {
		this.init(this.props.docUrl);
	}

	init(docUrl) {
		const self = this;

		AjaxTransport();

		$.ajax({
			url: docUrl,
			type: 'GET',
			dataType: 'binary',
			responseType: 'arraybuffer',
			processData: false,
			success: (response) => {
				const data = new Uint8Array(response);
				const arr = [];

				for (let i = 0; i !== data.length; ++i) {
					arr[i] = String.fromCharCode(data[i]);
				}

				const workbook = xlsx.read(arr.join(''), { type: 'binary' });
				const first_sheet_name = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[first_sheet_name];

				self.setState({ data: xlsx.utils.sheet_to_json(worksheet) });
			}
		});
	}

	render() {
		const self = this;
		const data = self.state.data;
		const mainContent = data && data.length > 0 ? data.map((item, i) => 
			<div key={i} className={`${Styles.item_row} ms-Grid-row`}>
				<div className={`${Styles.item_column} ms-Grid-col ms-u-sm6`}>	
					{item.Name}
				</div>
				<div className={`${Styles.item_column} ms-Grid-col ms-u-sm6`}>	
					{item.Type}
				</div>
			</div>
		) : null;

		return (
			<div className={Styles.container}>
				<p className={Styles.header}>
					Excel table
				</p>
				<div className={Styles.content}>
					<div className="ms-Grid">
						<div className={`${Styles.header_row} ms-Grid-row`}>
							<div className={`${Styles.header_column} ms-Grid-col ms-u-sm6`}>	
								Name
							</div>
							<div className={`${Styles.header_column} ms-Grid-col ms-u-sm6`}>	
								Type
							</div>
						</div>
						{mainContent}
					</div>
				</div>
			</div>
		);
	}
}

export default ExcelTableView;