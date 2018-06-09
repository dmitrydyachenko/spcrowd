import { bindActionCreators } from 'redux';

/* Actions */
import * as actionCreators from './actions';

export function mapStateToProps({
	contentTable
}) {
	return {
		contentTable
	};
}

export function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

/* Global Store */
export store from './data/index';