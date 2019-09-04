import { compose, withHandlers, pure, mapProps } from 'recompose'
import { connect } from 'react-redux'
import map from 'ramda/src/map'
import ifElse from 'ramda/src/ifElse'
import partial from 'ramda/src/partial'
import omit from 'ramda/src/omit'
import flip from 'ramda/src/flip'
import prop from 'ramda/src/prop'
import apply from 'ramda/src/apply'

const PARAMS = '$WITH_PARTIAL_ACTION_BIND_params'
const HANDLER = '$WITH_PARTIAL_ACTION_BIND_handler'

const omitProps = (keys) => mapProps((props) => omit(keys, props))
const isFunction = x => typeof x === 'function'
const lookup = flip(prop)

const withPartialActionBind = ({ action, name, args = [], builder = null }) => {
  return compose(
    connect(
      (state, props) => ({
        [PARAMS]: map(ifElse(isFunction, flip(apply)([state, props]), lookup(props)))(args)
      }),
      { [HANDLER]: action }
    ),
    withHandlers({
      [name]: ({ [PARAMS]: params, [HANDLER]: action }) => {
        return isFunction(builder) ? builder({ action, args: params }) : partial(action, params)
      }
    }),
    omitProps([PARAMS, HANDLER]),
    pure
  )
}

export default withPartialActionBind
