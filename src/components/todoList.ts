import { autobind } from "../decorators/autobind"
import { DragTarget } from "../models/drag-and-drop"
import { todoState } from "../state/todo-state"
import { Todo, TodoStatus } from "../models/todoModel"
import { Component } from "./baseComponent"
import { TodoItem } from "./todoItem"

export class TodoList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  addedTodos: Todo[]
  constructor(private type: "in-progress" | "finished") {
    super("todo-list", "app", false, `${type}-todos`)
    this.addedTodos = []

    this.configure()

    this.renderContent()
  }

  @autobind
  dragLeaveHandler(event: DragEvent): void {
    console.log("dragLeaveHandler triggered")
    const listEl = this.element.querySelector("ul")
    listEl?.classList.remove("droppable")
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    event.preventDefault()
    const listEl = this.element.querySelector("ul")
    listEl?.classList.add("droppable")
  }

  @autobind
  dropHandler(event: DragEvent): void {
    console.log("dropHandler triggered")
    const todoId = event.dataTransfer?.getData("text/plain")
    if (todoId) {
      todoState.moveTodo(
        todoId,
        this.type === "in-progress"
          ? TodoStatus.InProgress
          : TodoStatus.Finished
      )
    }
    console.log(todoId)
  }
  renderContent() {
    const listId = `${this.type}-todo-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " TODOS"
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler)
    this.element.addEventListener("dragleave", this.dragLeaveHandler)
    this.element.addEventListener("drop", this.dropHandler)
    todoState.addListener((todos: Todo[]) => {
      const relevantTodos = todos.filter((todo) => {
        if (this.type === "in-progress") {
          return todo.status === TodoStatus.InProgress
        }
        return todo.status === TodoStatus.Finished
      })
      this.addedTodos = relevantTodos
      this.renderTodos()
    })
  }

  private renderTodos() {
    const listEl = document.getElementById(
      `${this.type}-todo-list`
    )! as HTMLUListElement
    listEl.innerHTML = ""
    for (const todoItem of this.addedTodos) {
      new TodoItem(this.element.querySelector("ul")!.id, todoItem)
    }
  }
}
