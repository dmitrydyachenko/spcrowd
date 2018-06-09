import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

/* Reducers */
import Reducers from '../reducers/index';

/* Default States */
import contentTable from './contentTable';

const store = createStore(Reducers, {
	contentTable
});

export default store;