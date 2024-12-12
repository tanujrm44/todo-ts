import { Todo, TodoStatus } from "../models/todoModel"

type Listener<T> = (items: T[]) => void

export class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

export class TodoState extends State<Todo> {
  private todos: Todo[] = []
  private static instance: TodoState

  static getInstance() {
    if (this.instance) {
      return this.instance
    } else {
      this.instance = new TodoState()
      return this.instance
    }
  }

  addTodo(title: string, description: string, hours: number) {
    const newTodo = new Todo(
      Math.random().toString(),
      title,
      description,
      hours,
      TodoStatus.InProgress
    )
    this.todos.push(newTodo)
    this.updateListeners()
  }

  moveTodo(todoId: string, newStatus: TodoStatus) {
    const todo = this.todos.find((todo) => todo.id === todoId)

    if (todo) {
      todo.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.todos])
    }
  }
}

export const todoState = TodoState.getInstance()
