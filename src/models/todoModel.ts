export enum TodoStatus {
  InProgress,
  Finished,
}

export class Todo {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public hours: number,
    public status: TodoStatus
  ) {}
}
