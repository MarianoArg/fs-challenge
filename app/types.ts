export type Todo = {
  id: string;
  title: string;
  body?: string;
  status: "COMPLETED" | "INCOMPLETED";
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  fullname: string;
  todos: Todo[];
};
