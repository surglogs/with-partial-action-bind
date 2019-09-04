import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import withPartialActionBind from '../index'

configure({ adapter: new Adapter() })

describe('withPartialActionBind HOC', () => {
  it('connects action correctly', () => {
    const actionTracker = jest.fn()

    const store = createStore((state = true, action) => {
      actionTracker(action)

      return state
    })

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const MOCK_ACTION = (a, b, c) => ({
      type: 'MOCK_ACTION',
      payload: {
        a,
        b,
        c,
      },
    })

    const component = jest.fn(() => null)

    const Component = withPartialActionBind({
      action: MOCK_ACTION,
      name: 'mockAction',
    })(component)

    mount(
      <Provider {...{ store }}>
        <Component />
      </Provider>,
    )

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const { mockAction } = component.mock.calls[0][0]
    mockAction(1, 2, 3)

    expect(actionTracker).toHaveBeenCalledTimes(2)
    expect(actionTracker).toHaveBeenLastCalledWith({
      payload: {
        a: 1,
        b: 2,
        c: 3,
      },
      type: 'MOCK_ACTION',
    })
  })

  it('connects action correctly and binds first arg from component props', () => {
    const actionTracker = jest.fn()

    const store = createStore((state = true, action) => {
      actionTracker(action)

      return state
    })

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const MOCK_ACTION = (a, b, c) => ({
      type: 'MOCK_ACTION',
      payload: {
        a,
        b,
        c,
      },
    })

    const component = jest.fn(() => null)

    const Component = withPartialActionBind({
      action: MOCK_ACTION,
      name: 'mockAction',
      args: ['a'],
    })(component)

    mount(
      <Provider {...{ store }}>
        <Component {...{ a: 1 }} />
      </Provider>,
    )

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const { mockAction } = component.mock.calls[0][0]
    mockAction(2, 3)

    expect(actionTracker).toHaveBeenCalledTimes(2)
    expect(actionTracker).toHaveBeenLastCalledWith({
      payload: {
        a: 1,
        b: 2,
        c: 3,
      },
      type: 'MOCK_ACTION',
    })
  })

  it('connects action correctly and binds first arg from component props and second arg from state', () => {
    const actionTracker = jest.fn()

    const store = createStore((state = { b: 2 }, action) => {
      actionTracker(action)

      return state
    })

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const MOCK_ACTION = (a, b, c) => ({
      type: 'MOCK_ACTION',
      payload: {
        a,
        b,
        c,
      },
    })

    const component = jest.fn(() => null)

    const Component = withPartialActionBind({
      action: MOCK_ACTION,
      name: 'mockAction',
      args: ['a', state => state.b],
    })(component)

    mount(
      <Provider {...{ store }}>
        <Component {...{ a: 1 }} />
      </Provider>,
    )

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const { mockAction } = component.mock.calls[0][0]
    mockAction(3)

    expect(actionTracker).toHaveBeenCalledTimes(2)
    expect(actionTracker).toHaveBeenLastCalledWith({
      payload: {
        a: 1,
        b: 2,
        c: 3,
      },
      type: 'MOCK_ACTION',
    })
  })

  it('connects action correctly and binds first arg from component props using function', () => {
    const actionTracker = jest.fn()

    const store = createStore((state = true, action) => {
      actionTracker(action)

      return state
    })

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const MOCK_ACTION = (a, b, c) => ({
      type: 'MOCK_ACTION',
      payload: {
        a,
        b,
        c,
      },
    })

    const component = jest.fn(() => null)

    const Component = withPartialActionBind({
      action: MOCK_ACTION,
      name: 'mockAction',
      args: [(_, props) => props.a],
    })(component)

    mount(
      <Provider {...{ store }}>
        <Component {...{ a: 1 }} />
      </Provider>,
    )

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const { mockAction } = component.mock.calls[0][0]
    mockAction(2, 3)

    expect(actionTracker).toHaveBeenCalledTimes(2)
    expect(actionTracker).toHaveBeenLastCalledWith({
      payload: {
        a: 1,
        b: 2,
        c: 3,
      },
      type: 'MOCK_ACTION',
    })
  })

  it('connects action correctly and binds second arg from component props using builder', () => {
    const actionTracker = jest.fn()

    const store = createStore((state = true, action) => {
      actionTracker(action)

      return state
    })

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const MOCK_ACTION = (a, b, c) => ({
      type: 'MOCK_ACTION',
      payload: {
        a,
        b,
        c,
      },
    })

    const component = jest.fn(() => null)

    const Component = withPartialActionBind({
      action: MOCK_ACTION,
      name: 'mockAction',
      args: ['b'],
      builder: ({ action, args: [b] }) => (a, c) => action(a, b, c)
    })(component)

    mount(
      <Provider {...{ store }}>
        <Component {...{ b: 2 }} />
      </Provider>,
    )

    expect(actionTracker).toHaveBeenCalledTimes(1)

    const { mockAction } = component.mock.calls[0][0]
    mockAction(1, 3)

    expect(actionTracker).toHaveBeenCalledTimes(2)
    expect(actionTracker).toHaveBeenLastCalledWith({
      payload: {
        a: 1,
        b: 2,
        c: 3,
      },
      type: 'MOCK_ACTION',
    })
  })
})
