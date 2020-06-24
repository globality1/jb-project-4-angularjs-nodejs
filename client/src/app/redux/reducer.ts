import { AppState } from "./appState";
import { ActionType } from "./actionType";
import { Action } from "./action";


export class Reducer {

    public static reduce(oldAppState: AppState, action: Action): AppState {

        const newAppState = { ...oldAppState };

        switch (action.type) {

            // action when login
            case ActionType.Login:
                newAppState.user = action.payload.user;
                newAppState.isLoggedIn = true;
                newAppState.token = newAppState.user.token.replace(/"/gi, "");
                localStorage.setItem("token", JSON.stringify(newAppState.user.token));
                sessionStorage.setItem("token", JSON.stringify(newAppState.user.token));
                break;

            // action when storing products
            case ActionType.GetProducts:
                newAppState.products = action.payload.products;
                break;
            
            // action when setting cart info
            case ActionType.SetCart:
                newAppState.cart = action.payload.cart;
                break;

            // action when setting cart items  
            case ActionType.SetCartItems:
                newAppState.cartItems = action.payload.cartItems;
                break;

            // action when setting shop categories
            case ActionType.SetShopCategories:
                newAppState.shopCategories = action.payload.shopCategories;
                break;

            // action when calculating cart price
            case ActionType.SetNewCartTotalPrice:
                newAppState.cartTotalPrice = action.payload.cartTotalPrice;
                break;

            // action when doing order
            case ActionType.SetOrderItems:
                newAppState.orderItems = action.payload.orderItems;
                sessionStorage.setItem("orderItems", JSON.stringify(newAppState.orderItems));
                break;    

            // action when doing log out  
            case ActionType.Logout:
                newAppState.isLoggedIn = false;
                newAppState.user = {};
                newAppState.user.firstName = "guest"
                newAppState.token = null;
                newAppState.products = null;
                newAppState.cart = null;
                newAppState.cartTotalPrice = 0;
                newAppState.cartItems = null;
                sessionStorage.removeItem("orderItems");
                sessionStorage.removeItem("token");
                localStorage.removeItem("token");
                break;

            default: break;
        }

        return newAppState;
    }
}
