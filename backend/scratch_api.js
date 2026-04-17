import axios from "axios";

async function checkAPI() {
    try {
        // Try to login as student@gmail.com
        const res1 = await axios.post("http://localhost:3000/api/v1/auth/login", {
            email: "student@gmail.com",
            password: "test" // we don't know the password. Wait, I can generate a token manually.
        });
        console.log(res1.data);
    } catch(e) {
        console.log(e.message);
    }
}
checkAPI();
