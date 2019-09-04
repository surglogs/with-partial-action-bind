# withPartialActionBind

[![Build Status](https://travis-ci.org/surglogs/with-partial-action-bind.svg?branch=master)](https://travis-ci.org/surglogs/with-partial-action-bind)

withPartialActionBind is a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html) that allows you to connect a [`Redux`](https://redux.js.org/) action and bind some of action's arguments with incoming props or redux state.

## Instalation

`npm i @surglogs/with-partial-action-bind recompose`

## What is this library good for?

> It helps you to cut the boilerplate that is often needed when dispatching a [`Redux`](https://redux.js.org/) action.

### Todo list example

Let's say we have a list of todos stored in the [`redux`](https://redux.js.org/) store. User did some changes to them and we have to send the edited todos to our server. Therefore we need to get the `todos` from our state and dispatch `updateTodos` action. We can do these two things nicely at once using `withPartialActionBind`:

```js
import withPartialActionBind from '@surglogs/with-partial-action-bind'

// We will not go into the details how the the todos are actually updated
// We will simply assume there is some Redux middleware for handling async workflow like redux thunk, redux saga or redux promise middleware which sends them to the server
const updateTodos = (todos) => {
  return {
    type: 'UPDATE_TODOS',
    payload: {
      todos
    }
  }
}

const SaveTodosButton = ({ updateTodos }) => <button onClick={updateTodos}>Save todos</button>

const ConnectedSaveTodosButton = withPartialActionBind({
  action: updateTodos,
  name: 'updateTodos',
  args: [state => state.todos]
})(SaveTodosButton)

export default ConnectedSaveTodosButton
```

That's it! In `args: [state => state.todos]` we binded the `todos` argument to be `state.todos`, therefore we can directly pass  the binded action `updateTodos` to the button as an onClick handler.

Let's say now that we have multiple todo lists, therefore if we want to update todos of one todo list we also need to send the name of the todo list. The name is passed as a prop `name` to the `ConnectedSaveTodosButton` component. Our code will look like this:

```js
const updateTodos = (todos, todoListName) => {
  return {
    type: 'UPDATE_TODOS',
    payload: {
      todos,
      todoListName
    }
  }
}

const SaveTodosButton = ({ updateTodos }) => <button onClick={updateTodos}>Save todos</button>

const ConnectedSaveTodosButton = withPartialActionBind({
  action: updateTodos,
  name: 'updateTodos',
  args: [state => state.todos, 'name']
  // args: [state => state.todos, (state, props) => props.name] // also works :)
})(SaveTodosButton)
```

As you can see, we changed our `args` to `[state => state.todos, 'name']`. By putting `'name'` we are telling that the second argument should be an incoming prop `name`.

We will change our component again. Let's say for some reason we do not want to bind the `todoListName` argument. That is also possible:

```js
const SaveTodosButton = ({ updateTodos }) => <button onClick={() => updateTodos('our great todoList')}>Save todos</button>

const ConnectedSaveTodosButton = withPartialActionBind({
  action: updateTodos,
  name: 'updateTodos',
  args: [state => state.todos]
})(SaveTodosButton)
```

If we do not bind all of the arguments in `withPartialActionBind`, we can just pass them when calling the action.

Finally, what if we don't want to bind the `todoListName` again but it is the first argument of the action? Like this:

```js
const updateTodos = (todoListName, todos) => {
  return {
    type: 'UPDATE_TODOS',
    payload: {
      todos,
      todoListName
    }
  }
}
```

We can pass a special function builder, that allows us to pass the argument using custom logic:

```js
const SaveTodosButton = ({ updateTodos }) => <button onClick={() => updateTodos('our great todoList')}>Save todos</button>

const ConnectedSaveTodosButton = withPartialActionBind({
  action: updateTodos,
  name: 'updateTodos',
  args: [state => state.todos],
  builder: ({ action, args: [todos] }) => {
    return (todoListName) => action(todoListName, todos)
  }
})(SaveTodosButton)
```
