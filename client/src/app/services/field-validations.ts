// internal services file for field and values validations when passed within api calls from within the application
import { Injectable } from '@angular/core';
import { CategoriesModel } from '../models/categories-model';


@Injectable({
    providedIn: 'root'
})

export class FieldValidationService {

    constructor() { }

    // check if value is empty
    public checkIfEmpty(valueToCheck: any) {
        if (!valueToCheck) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }

    // check if email is valid
    public checkIfEmailFormat(valueToCheck: string) {
        // correct format validation for email - so it will be [1-9,a-z,any symbol and english]@[email].[domain]
        const emailValidationFormat = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!emailValidationFormat.test(valueToCheck)) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }

    // personal id validation
    public checkIfPersonalIdNotFake(valueToCheck: number) {
        // correct format validation for email - so it will be [1-9,a-z,any symbol and english]@[email].[domain]
        if (valueToCheck.toString().length !== 9 || valueToCheck <= 10000000) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }

    // check if  is valid
    public checkIfFieldInZone(valueToCheck: string) {
        // only words allowed with spaces
        const onlyAllowed = /^[a-zA-Z_]+( [a-zA-Z_]+)*$/;
        if (valueToCheck.length > 15 || valueToCheck.length < 2 || !onlyAllowed.test(valueToCheck)) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }

    // check if password is valid
    public checkIfPasswordValid(valueToCheck: string) {
        // create a regex check for password at least 1 upper case, 1 lower case and 1 special character
        const passwordValidationFormat = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
        // validate regex
        if (!passwordValidationFormat.test(valueToCheck) || valueToCheck.length < 8 || valueToCheck.length > 20) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }

    // check if credit card is in the correct format and 16 digits long
    public creditCardValidation(valueToCheck) {
        // rgex validation for all sort of Credit card types - source from https://www.regular-expressions.info/creditcard.html
        const creditCardValidationFormat = /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
        if (!creditCardValidationFormat.test(valueToCheck) || valueToCheck.length !== 16) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }

    // filters all products with given category from products array
    public categoryValidation(categories: CategoriesModel[], id: number) {
        let validCategory: boolean;
        for (let i = 0; i < categories.length; i++) {
            if (+categories[i].categoryId === +id) {
                validCategory = true;
            }
        }
        if (validCategory) {
            return true;
        }
        return false;
    }

}
