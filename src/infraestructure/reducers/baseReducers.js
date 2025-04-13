const createStandardReducers = () => {
  return {
    addItem: (state, action) => ({
      ...state,
      data: [action.payload, ...state.data],
    }),
    updateItem: (state, action) => ({
      ...state,
      data: state.data.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item,
      ),
    }),
    removeItem: (state, action) => ({
      ...state,
      data: state.data.filter((item) => item.id !== action.payload.id),
    }),
    readItem: (_, action) => action.payload,
    clearItems: () => [],
    setLoading: (state, action) => ({ ...state, isLoading: action.payload }),
  };
};

export default createStandardReducers;
