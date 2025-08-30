import { publicRequest, userRequest } from "../requestMethods";
import { addProductFailure, addProductStart, addProductSuccess, deleteProductFailure, deleteProductStart, deleteProductSuccess, getProductFailure, getProductStart, getProductSuccess, updateProductFailure, updateProductStart, updateProductSuccess } from "./productRedux";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, getUsersFailure, getUsersStart, getUsersSuccess, loginFailure, loginStart, loginSuccess } from "./userRedux"


export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/auth/login", user);
        if (!res.data.isAdmin) {
            dispatch(loginFailure("Access denied. Admin privileges required."));
            return null;
        }
        dispatch(loginSuccess(res.data));
        return res.data;
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Login failed";
        dispatch(loginFailure(errorMessage));
        throw err;
    }
};


export const getProducts = async (dispatch) =>{
    dispatch(getProductStart());
    try {
        const res = await publicRequest.get("/products");
        dispatch(getProductSuccess(res.data));
    } catch (err) {
        dispatch(getProductFailure());
        
    };
};

//Delete
export const deleteProduct = async (id, dispatch) => {
    dispatch(deleteProductStart());
    try {
        await userRequest.delete(`/products/${id}`);
        dispatch(deleteProductSuccess(id));
        return { success: true, message: "Product deleted successfully" };
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete product";
        dispatch(deleteProductFailure(errorMessage));
        throw err;
    }
};

//Add Product
export const addProduct = async (product, dispatch) => {
    dispatch(addProductStart());
    try {
        const res = await userRequest.post("/products", product);
        dispatch(addProductSuccess(res.data));
        return { success: true, message: "Product added successfully" };
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to add product";
        dispatch(addProductFailure(errorMessage));
        throw err;
    }
};

//Update
export const updateProduct = async (id, product, dispatch) => {
    dispatch(updateProductStart());
    try {
        const res = await userRequest.put(`/products/${id}`, product);
        dispatch(updateProductSuccess({ id: id, product: res.data }));
        return { success: true, message: "Product updated successfully" };
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to update product";
        dispatch(updateProductFailure(errorMessage));
        throw err;
    }
};

//Get Users
export const getUsers = async (dispatch) =>{
    dispatch(getUsersStart());
    try {
        const res = await userRequest.get("/users");
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getUsersFailure());
    };
};

// Delete User
export const deleteUser = async (id, dispatch) => {
    dispatch(deleteUserStart());
    try {
        await userRequest.delete(`/users/${id}`);
        dispatch(deleteUserSuccess(id));
        return { success: true, message: "User deleted successfully" };
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete user";
        dispatch(deleteUserFailure(errorMessage));
        throw err;
    }
};