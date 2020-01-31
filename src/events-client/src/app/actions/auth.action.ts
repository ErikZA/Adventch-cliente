export const IsLogin = (value: boolean) => {

    if (!value) {
        localStorage.clear();
    }

    return {
        type: "IS_AUTH",
        payload: value
    }
}