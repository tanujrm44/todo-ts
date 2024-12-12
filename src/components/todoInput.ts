import { autobind } from "../decorators/autobind"
import { todoState } from "../state/todo-state"
import { Validatable, validate } from "../utils/validation"
import { Component } from "./baseComponent"

export class TodoInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  hoursInputElement: HTMLInputElement
  todos = []
  constructor() {
    super("todo-input", "app", true, "user-input")
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement
    this.hoursInputElement = this.element.querySelector(
      "#hours"
    )! as HTMLInputElement

    this.configure()
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler)
  }

  renderContent() {}

  private getUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredHours = this.hoursInputElement.value

    const isValidTitle: Validatable = {
      value: enteredTitle,
      required: true,
    }
    const isValidDescription: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const isValidHours: Validatable = {
      value: enteredHours,
      required: true,
      min: 1,
      max: 10,
    }

    if (
      !validate(isValidTitle) ||
      !validate(isValidDescription) ||
      !validate(isValidHours)
    ) {
      alert("Please enter all fields")
      return
    } else {
      return [enteredTitle, enteredDescription, +enteredHours]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ""
    this.descriptionInputElement.value = ""
    this.hoursInputElement.value = ""
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.getUserInput()
    if (Array.isArray(userInput)) {
      const [title, description, hours] = userInput
      this.todos.push()
      todoState.addTodo(title, description, hours)
      this.clearInputs()
    }
  }
}
