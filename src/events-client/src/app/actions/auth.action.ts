import { } from '@angular/router';

export const IsLogin = (value: boolean) => {

    if (value) {
        localStorage.setItem("token", JSON.stringify("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2QiOjF9.xvDv5cIn1qck9Xmx9fAW3mi485FsgqRPMTxbK61ODJSByXNlPm5tfmMyj0mGHd4z3Eb4poOBdPYusMtu_1wpRqnSR_XB7xkkBydAEyZWJ40UZ75mT6_i3x1sF_OxLWK00VB2WbwCeGEQExn0rF0S_tK47UYOY6yqTFTPt6_oWQ4"))
        return {
            type: "IS_AUTH",
            payload: value
        }
    }

    localStorage.clear();

    return {
        type: "IS_AUTH",
        payload: value
    }
}