import { csrfFetch } from "./csrf";

const initialState = { user: null };

const SET_USER = 'session/setUser';
const DELETE_SESSION = 'session/deleteSession';

// ACTION CREATORS

export const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    };
};

export const deleteSession = () => {
    return {
        type: DELETE_SESSION
    };
};

// THUNKS

export const fetchUser = (user) => async (dispatch) => {
    const { credential, password } = user;

    const res = await csrfFetch(`/api/session`, {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    });

    const data = await res.json();
    dispatch(setUser(data.user));

    return res;
};

export const restoreUser = () => async (dispatch) => {
    const res = await csrfFetch('/api/session');
    const data = await res.json();
    
    dispatch(setUser(data.user));

    return res;
};

export const signup = (user) => async (dispatch) => {
    const { firstName, lastName, username, email, password } = user;

    const res = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password,
      }),
    });

    const data = await res.json();
    dispatch(setUser(data.user));
    
    return res;
};

export const logout = () => async (dispatch) => {
    const res = await csrfFetch('/api/session', {
      method: 'DELETE',
    });

    dispatch(deleteSession());
    return res;
};

// REDUCER

const sessionReducer = (state = initialState, action) => {
    const currentState = { ...state };
    
    switch (action.type) {
        case SET_USER: {
            currentState.user = action.payload;

            return currentState;
        };

        case DELETE_SESSION: {
            currentState.user = null;

            return currentState;
        };

        default: return currentState;
    };
};

export default sessionReducer;