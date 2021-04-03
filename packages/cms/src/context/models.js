import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

import listApi from "api/list";

const ListContext = createContext();

const useModels = () => {
  return useContext(ListContext);
};

const API_NAME = "Model";
const initialState = {
  status: "idle",
  error: null,
  list: [],
  selected: null,
  selectedId: null,
  selectedIdx: null,
  hydrating: false,
};

const ModelsProvider = (props) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "HYDRATE":
        return { ...state, status: "HYDRATE" };
      case "FETCHING":
        return { ...state, hydrating: true };
      case "FETCHED":
        return {
          ...state,
          status: "idle",
          hydrating: false,
          list: action.payload,
        };
      case "FETCH_ERROR":
        return {
          ...state,
          status: "idle",
          hydrating: false,
          error: action.payload,
        };
      case "SELECT_ID":
        return { ...state, selectedId: action.id };
      case "SELECT":
        return { ...state, selected: action.payload, selectedIdx: action.idx };
      case "UPDATE_SELECTED":
        return { ...state, selected: action.payload };
      default:
        return state;
    }
  }, initialState);

  const selectById = useCallback(
    (id) => {
      const list = state.list;
      const idx = list.findIndex((item) => item.id === id);
      if (idx < 0) return;
      dispatch({ type: "SELECT", payload: list[idx], idx });
    },
    [dispatch, state.list]
  );

  const hydrate = useCallback(async () => {
    dispatch({ type: "FETCHING" });
    try {
      const res = await listApi({ apiName: API_NAME });
      let data = [];
      if (res?.Items) data = res.Items;
      dispatch({ type: "FETCHED", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  }, []);

  useEffect(() => {
    state.status === "HYDRATE" && hydrate();
  }, [state.status, selectById, hydrate]);

  useEffect(() => {
    state.selectedId && selectById(state.selectedId);
  }, [state.selectedId, selectById]);

  useEffect(() => {
    // run on mount
    hydrate();
  }, [hydrate]);

  return (
    <ListContext.Provider value={{ dispatch, ...state }}>
      {props.children}
    </ListContext.Provider>
  );
};

export { ModelsProvider, useModels };
