import { AppState } from "./appState";
import { ActionType } from "./actionType";
import { Action } from "./action";


export class Reducer {

    public static reduce(oldAppState: AppState, action: Action): AppState {

        const newAppState = { ...oldAppState };

        switch (action.type) {

            // action when login
            case ActionType.Login:
                newAppState.isLoggedIn = true;
                newAppState.user = action.payload.user;
                newAppState.token = newAppState.user.token;
                newAppState.isAdmin = newAppState.user.isAdmin;
                sessionStorage.setItem("user", JSON.stringify(newAppState.user));
                break;

            // action when storing products
            case ActionType.GetProducts:
                newAppState.products = action.payload.products;
                sessionStorage.setItem("products", JSON.stringify(newAppState.products));
                break;
            
            // action when setting cart info
            case ActionType.SetCart:
                newAppState.cart = action.payload.cart;
                sessionStorage.setItem("cart", JSON.stringify(newAppState.cart));
                break;

            // action when setting cart items  
            case ActionType.SetCartItems:
                newAppState.cartItems = action.payload.cartItems;
                sessionStorage.setItem("cartItems", JSON.stringify(newAppState.cartItems));
                break;

            // action when setting shop categories
            case ActionType.SetShopCategories:
                newAppState.shopCategories = action.payload.shopCategories;
                sessionStorage.setItem("shopCategories", JSON.stringify(newAppState.shopCategories));
                break;

            // action when calcuating cart price
            case ActionType.SetNewCartTotalPrice:
                newAppState.cartTotalPrice = action.payload.cartTotalPrice;
                sessionStorage.setItem("cartTotalPrice", JSON.stringify(newAppState.cartTotalPrice));
                break;

            // action when doing order
            case ActionType.SetOrderItems:
                newAppState.orderItems = action.payload.orderItems;
                sessionStorage.setItem("orderItems", JSON.stringify(newAppState.orderItems));
                break;    

            // action when doing log out  
            case ActionType.Logout:
                newAppState.isLoggedIn = false;
                newAppState.user = null;
                newAppState.token = null;
                newAppState.isAdmin = 0;
                newAppState.products = null;
                newAppState.cart = null;
                newAppState.cartTotalPrice = 0;
                newAppState.cartItems = null;
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("products");
                sessionStorage.removeItem("cart");
                sessionStorage.removeItem("cartItems");
                sessionStorage.removeItem("cartTotalPrice");
                sessionStorage.removeItem("shopCategories");
                break;

            default: break;
        }

        return newAppState;
    }
}
