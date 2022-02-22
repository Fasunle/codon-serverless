import { API } from "aws-amplify";
import { useReducer, useEffect } from "react";
import { List, Button, Input } from "antd";
import { v4 as uuid } from "uuid";
import "./App.css";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  updateNote as updateNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

// generate unique identifier for the user
const CLIENT_ID = uuid();

const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: "", description: "" },
};

const styles = {
  container: { padding: 20 },
  input: { marginBottom: 10 },
  item: { textAlign: "left" },
  p: { color: "#1890ff" },
};

const ACTION_ = {
  SET_NOTE: "SET_NOTE",
  ADD_NOTE: "ADD_NOTE",
  RESET_FORM: "RESET_FORM",
  SET_INPUT: "SET_INPUT",
  ERROR: "ERROR",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_.SET_NOTE:
      return { ...state, notes: action.notes, loading: false };

    case ACTION_.ADD_NOTE:
      return { ...state, notes: [action.note, ...state.notes] };

    case ACTION_.RESET_FORM:
      return { ...state, form: initialState.form };

    case ACTION_.SET_INPUT:
      return { ...state, form: { ...state.form, [action.name]: action.value } };

    case ACTION_.ERROR:
      return { ...state, loading: false, error: true };

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNotes = async () => {
    try {
      const notesData = await API.graphql({ query: listNotes });
      dispatch({
        type: ACTION_.SET_NOTE,
        notes: notesData.data.listNotes.items,
      });
    } catch (error) {
      console.error("error: ", error);
      dispatch({ type: ACTION_.ERROR });
    }
  };

  const createNote = async () => {
    const { form } = state;

    if (!form.name && !form.description) {
      alert("Please enter name and description");
      return;
    }

    const note = { ...form, clientId: CLIENT_ID, id: uuid(), completed: false };
    dispatch({ type: ACTION_.ADD_NOTE, note });
    dispatch({ type: ACTION_.RESET_FORM });

    try {
      await API.graphql({
        query: createNoteMutation,
        variables: { input: note }, // ! NOTE since input is specified as the graphql argument, it must be handled as shown here
      });
      // console.log("Successfully created note!");
    } catch (error) {
      console.log("error: ", error);
      dispatch({ type: ACTION_.ERROR });
    }
  };

  const updateNote = async (note) => {
    const foundNote = state.notes.find((n) => n.id === note.id);
    foundNote.completed = !note.completed;

    try {
      await API.graphql({
        query: updateNoteMutation,
        variables: {
          input: { id: note.id, completed: foundNote.completed },
        },
      });
      dispatch({ type: ACTION_.SET_INPUT, notes: state.notes });
      console.log("Updated successfully");
    } catch (error) {
      console.log("Error: ", error);
      dispatch({ type: ACTION_.ERROR });
    }
  };
  const deleteNote = async (item) => {
    const notes = state.notes.filter((n) => n.id !== item.id);
    try {
      await API.graphql({
        query: deleteNoteMutation,
        variables: { input: { id: item.id } },
      });
      console.log("💯 successful deletion");
      dispatch({ type: ACTION_.SET_NOTE, notes });
    } catch (error) {
      console.log("Error: ", error);
      dispatch({ type: ACTION_.ERROR });
    }
  };
  const onChange = (e) => {
    dispatch({
      type: ACTION_.SET_INPUT,
      name: e.target.name,
      value: e.target.value,
    });
  };

  const renderItem = (item) => {
    return (
      <List.Item
        className={styles.item}
        actions={[
          <p style={styles.p} onClick={() => deleteNote(item)}>
            Delete
          </p>,
          <p style={styles.p} onClick={() => updateNote(item)}>
            {item.completed ? "✔ Completed" : "Mark completed"}
          </p>,
        ]}>
        <List.Item.Meta
          className={styles.input}
          title={item.name}
          description={item.description}
        />
      </List.Item>
    );
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className={styles.container}>
      <Input
        onChange={onChange}
        name="name"
        value={state.form.name}
        placeholder="Note Name"
        style={styles.input}
      />
      <Input
        onChange={onChange}
        name="description"
        value={state.form.description}
        placeholder="Note Description"
        style={styles.input}
      />
      <Button type="primary" onClick={createNote}>
        Create New Note
      </Button>
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  );
}

export default App;
