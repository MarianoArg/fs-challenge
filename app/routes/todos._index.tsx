import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import Card from "~/components/Card";
import { useParentData } from "~/components/OutletWithContext";
import type { Todo } from "~/types";
import { MdClear } from "react-icons/md";
import type { FormEvent } from "react";
import React from "react";

const filters = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Incompleted",
    value: "incompleted",
  },
];

export default function TodoIndexPage() {
  const todoList = useParentData<Todo[]>();
  const [params] = useSearchParams();
  const fetcher = useFetcher();
  const newTodoFetcher = useFetcher();
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = React.useState<string | null>(null);

  const askConfirmDelete = (id: string) => {
    setTodoToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      fetcher.submit(null, {
        action: `/todos/${todoToDelete}`,
        method: "DELETE",
        replace: true,
      });
    }

    setShowDeleteDialog(false);
  };

  function handleStatusChange(event: FormEvent<HTMLFormElement>) {
    const { target } = event;
    const formData = new FormData();
    const status = (target as HTMLInputElement).checked
      ? "COMPLETED"
      : "INCOMPLETED";
    const id = (target as HTMLInputElement).value;

    formData.append("status", status);

    fetcher.submit(formData, {
      action: `/todos/${id}`,
      method: "PATCH",
      replace: true,
    });
  }

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { currentTarget } = event;

    newTodoFetcher.submit(currentTarget, {
      method: "POST",
      action: "/todos/new",
      replace: true,
    });
    currentTarget.reset();
  };

  return (
    <Card title="Todo List" withLogo>
      <div className="w-[440px]">
        <div>
          <newTodoFetcher.Form onSubmit={handleAddTodo}>
            <TextField
              id="title"
              label="Add a new todo"
              name="title"
              type="text"
              autoFocus={true}
              size="small"
              variant="standard"
              fullWidth
            />
          </newTodoFetcher.Form>
          <div className="mt-8 max-h-80 w-full overflow-y-auto">
            <fetcher.Form className="flex w-full" onChange={handleStatusChange}>
              <ul className="flex w-full flex-col gap-y-2">
                {todoList.map((todo) => (
                  <li key={todo.id} className="group w-full">
                    <div className="flex w-full items-center justify-between">
                      <FormControlLabel
                        id="status"
                        name="status"
                        value={todo.id}
                        control={
                          <Checkbox
                            size="small"
                            defaultChecked={todo.status === "COMPLETED"}
                          />
                        }
                        sx={{
                          padding: 0,
                          "&:hover": { color: "#5A77E1" },
                        }}
                        label={todo.title}
                      />
                      <Tooltip title="Delete Todo" placement="right">
                        <button
                          type="button"
                          onClick={() => askConfirmDelete(todo.id)}
                          className="hidden font-bold text-[#bfbfbf] hover:text-skyBlue group-hover:block"
                        >
                          <MdClear />
                        </button>
                      </Tooltip>
                    </div>
                  </li>
                ))}
              </ul>
            </fetcher.Form>
          </div>
        </div>
        <div className="mt-12 flex w-full items-center gap-x-5 text-sm">
          <span className="font-semibold text-darkBlueGrey/[.59]">Show:</span>
          <div className="flex gap-2.5">
            {filters.map((filter) => {
              const isActive = filter.value === params.get("q");
              return filter.value === params.get("q") ? (
                <span key={filter.value ?? "" + 1}>{filter.label}</span>
              ) : (
                <Link
                  key={filter.value ?? "" + 1}
                  to={filter.value ? `/todos?q=${filter.value}` : "/todos"}
                  className={
                    isActive ? "text-darkBlueGrey" : "text-coolBlue underline"
                  }
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Snackbar
        open={false}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {}
        </Alert>
      </Snackbar>
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontSize: "22px", fontWeight: 600 }}
        >
          {"Delete this Todo?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: "1rem" }}
          >
            This action cannot be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "24px 16px" }}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            autoFocus
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
