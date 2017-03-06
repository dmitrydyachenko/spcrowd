import React from 'react';
import TextFieldComponent from '../Partials/TextFieldComponent/TextFieldComponent';
import Button from '../Partials/Button/Button';
import Styles from './SearchArchiveProjects.scss';

class SearchArchiveProjects extends React.Component {
	static propTypes = {
		onSearchClick: React.PropTypes.func,
		href: React.PropTypes.string
	};

	constructor() {
		super();
		this.state = {
			filterText: ''
		};
		this.handleTextboxChange = this.handleTextboxChange.bind(this);
		this.handleSearchArchivedProjectsClick = this.handleSearchArchivedProjectsClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleTextboxChange(text) {
		this.setState({ filterText: text }, () => {
			this.props.onSearchClick(this.state.filterText);
		});
	}

	handleSearchArchivedProjectsClick() {
		this.props.onSearchClick(this.state.filterText);
	}

	handleKeyPress(e) {
		if (e.which === 13) {
			e.preventDefault();
			this.props.onSearchClick(this.state.filterText);
		}
	}

	render() {
		const searchArchiveProjectsLabel = this.props.href ? 
		(
			<a className="ms-Button" href={this.props.href}>
				<span className="ms-Button-label">Search archived projects</span>
			</a>
		)
		:
		(
			<div className={Styles.label_area}>
				Search archived projects
			</div>
		);

		const searchArchiveProjectsContent = !this.props.href ? 
		(
			<div className="ms-Grid-row">
				<div className={`${Styles.block} ms-Grid-col ms-u-sm12`} onKeyPress={this.handleKeyPress}>
					<div className={Styles.input}>
						<TextFieldComponent placeholder="Keyword" 
											className={Styles.text_area} 
											onChange={this.handleTextboxChange} />
					</div>
					<div className={Styles.button}>
						<Button value="Search" 
								className={Styles.button_area}
								onClick={this.handleSearchArchivedProjectsClick} />
					</div>
				</div>
			</div>
		) : null;

		return (
			<div className={Styles.container}>
				<div className="ms-Grid-row">
					<div className={`${Styles.label} ms-Grid-col ms-u-sm12`}>
						{searchArchiveProjectsLabel}
					</div>
				</div>
				{searchArchiveProjectsContent}
			</div>
		);
	}
}

export default SearchArchiveProjects;