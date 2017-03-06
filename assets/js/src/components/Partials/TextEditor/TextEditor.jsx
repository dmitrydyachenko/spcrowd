/* External libraries */
import React, { Component } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

/* Components */
import { GetAssetsPath } from '../../../utils/utils';
import { IMGPATH } from '../../../utils/settings';

/* CSS styles */
import Styles from './TextEditor.scss';

export default class TextEditor extends Component {
	static propTypes = {
		title: React.PropTypes.string.isRequired,
		field: React.PropTypes.string.isRequired,
		content: React.PropTypes.string,
		onEditorStateChange: React.PropTypes.func
	};

	constructor() {
		super();
		this.state = {
			inputEditorState: undefined,
			content: null
		};
	}

	componentDidMount() {
		this.setValue(this.props.content);
	}

	componentWillReceiveProps(nextProps) {        
		this.setValue(nextProps.content);
	}

	setValue(content) {
		if (content) {
			this.setState({ content }, () => {
				const contentBlock = htmlToDraft(`<p>${this.props.content || ''}</p>`);

				if (contentBlock) {
					const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
					const inputEditorState = EditorState.createWithContent(contentState);

					this.setState({
						inputEditorState
					});
				}
			});
		}
	}

	onInputEditorChange = (inputEditorState) => {
		const rawContent = convertToRaw(inputEditorState.getCurrentContent());
		const value = draftToHtml(rawContent);
		const contentBlock = htmlToDraft(value);

		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const outputEditorState = EditorState.createWithContent(contentState);

			this.setState({ inputEditorState, outputEditorState }, () => {
				this.props.onEditorStateChange(value, this.props.field);
			});
		}
	}
	
	render() {
		const toolbar = {
			options: ['inline', 'history', 'link', 'list'],
			inline: {
				options: ['bold', 'italic', 'underline'],
				bold: { icon: `${GetAssetsPath() + IMGPATH}/bold.svg` },
				italic: { icon: `${GetAssetsPath() + IMGPATH}/italic.svg` },
				underline: { icon: `${GetAssetsPath() + IMGPATH}/underline.svg` }
			},                      
			list: { 
				unordered: { icon: `${GetAssetsPath() + IMGPATH}/unordered.svg` },
				ordered: { icon: `${GetAssetsPath() + IMGPATH}/ordered.svg` }
			},
			link: { 
				link: { icon: `${GetAssetsPath() + IMGPATH}/link.svg` },
				unlink: { icon: `${GetAssetsPath() + IMGPATH}/unlink.svg` }
			},
			history: {
				undo: { icon: `${GetAssetsPath() + IMGPATH}/undo.svg` },
				redo: { icon: `${GetAssetsPath() + IMGPATH}/redo.svg` }
			}
		};

		return (
			<div className="demo_root">
				<div className="demo_label">
					<h1>{this.props.title}</h1>
				</div>
				<div className="demo_editorSection">
					<Editor editorState={this.state.inputEditorState} 
								onEditorStateChange={this.onInputEditorChange} 
								toolbar={toolbar}
								toolbarClassName="demo_toolbar"
								wrapperClassName="demo_wrapper" 
								editorClassName="demo_editor" />
				</div>
			</div>
		);
	}
}
