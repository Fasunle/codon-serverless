import { API } from "aws-amplify";
import { useReducer, useEffect } from "react";
import { List } from "antd";
import { v4 as uuid } from "uuid";
import "./App.css";
import { listNotes } from "./graphql/queries";
import { createNote } from "./graphql/mutations";

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

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTE":
      return { ...state, notes: action.notes, loading: false };

    case "ADD_NOTE":
      return { ...state, notes: [action.note, ...state.notes] };

    case "RESET_FORM":
      return { ...state, form: initialState.form };

    case "SET_INPUT":
      return { ...state, form: { ...state.form, [action.name]: action.value } };

    case "ERROR":
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
      dispatch({ type: "SET_NOTE", notes: notesData.data.listNotes.items });
    } catch (error) {
      console.error("error: ", error);
      dispatch({ type: "ERROR" });
    }
  };

  const createNote = async () => {
    const { form } = state;

    if (!form.name && !form.description) {
      alert("Please enter name and description");
    }

    const note = { ...form, clientId: CLIENT_ID, id: uuid(), completed: false };
    dispatch({ type: "ADD_NOTE", note });
    dispatch({ type: "RESET_FORM" });

    try {
      await API.graphql({
        query: createNote,
        variables: note,
      });
      console.log("Successfully created note!");
    } catch (error) {
      console.log("error: ", error);
      dispatch({ type: "ERROR" });
    }
  };

  const renderItem = (item) => {
    return (
      <List.Item className={styles.item}>
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
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  );
}

export default App;
