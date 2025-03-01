import {onAuthenticateUser} from "@/actions/user";
import {redirect} from "next/navigation";

const AuthCallbackPage = async () => {
    const auth = await onAuthenticateUser();
    if (auth) {
        return redirect(`/`)
    }
    else {
        return redirect(`/auth/sign-in`)
    }
}

export default AuthCallbackPage