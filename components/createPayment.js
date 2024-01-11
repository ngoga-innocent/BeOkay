import AsyncStorage from "@react-native-async-storage/async-storage";
import Url from "../Url";

export default async function createPayment(phonenumber, amount) {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
        return { "success": false };
    }

    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `JWT ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "phone_number": phonenumber,
            "amount": amount
        });

        const requestOptions = {
            headers: myHeaders,
            method: 'POST',
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch(`${Url}/patients/payment/`, requestOptions);
        const result = await response.json();

        return { "success": true, "reference_key": result.ref };
    } catch (error) {
        console.log(error);
        return { "success": false, "error": error };
    }
}
