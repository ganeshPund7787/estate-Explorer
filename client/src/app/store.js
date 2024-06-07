import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userReducer from "../app/features/userSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { version } from "mongoose"

const rootReducer = combineReducers({ user: userReducer })

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persisterReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persisterReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store)