import { validate } from 'prop-types';
import { isDevelopment } from '../helpers/utilities';

/**
 * @param {Object} schema
 * @return {Function}
 */
export default schema => {

    return props => {
        isDevelopment() && validate(schema, props, props.node.nodeName.toLowerCase());
        return props;
    };

};
