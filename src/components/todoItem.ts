import { autobind } from "../decorators/autobind"
import { Draggable } from "../models/drag-and-drop"
import { Todo } from "../models/todoModel"
import { Component } from "./baseComponent"

export class TodoItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  get hours() {
    if (this.todo.hours === 1) {
      return "1 hour"
    } else {
      return `${this.todo.hours} hours`
    }
  }
  constructor(hostId: string, public todo: Todo) {
    super("single-todo", hostId, false, todo.id)

    this.configure()
    this.renderContent()
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    console.log("Drag Start")
    event.dataTransfer!.setData("text/plain", this.todo.id)
    event.dataTransfer!.effectAllowed = "move"
  }

  dragEndHandler(event: DragEvent): void {
    console.log("Drag End")
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler)
    this.element.addEventListener("dragend", this.dragEndHandler)
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.todo.title
    this.element.querySelector("h3")!.textContent = this.hours + " to complete"
    this.element.querySelector("p")!.textContent = this.todo.description
  }
}
