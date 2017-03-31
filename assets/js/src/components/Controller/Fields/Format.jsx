export function CheckConstraintFormat(value, type) {
	const traceObject = {
		type,
		message: '',
		valid = false
	}

	switch (type) {
		case 'taxonomy':
			if (value) {
				if (value.indexOf(':') > 0) {
					traceObject.value = true;
				} else {
					traceObject.message = 
						'Missing \':\' ; Constraint format is: Term Set Name:Term Group Name 1,Term Group Name 2,...';
				}
			} else {
				traceObject.message = 'Constraint value is empty';
			}
			break;
		default:
			break;
	}

	return traceObject;
}