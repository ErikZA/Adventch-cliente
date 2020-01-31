export const IsLogin = (value: boolean) => {
    console.log(value);
    if (!value) {
        localStorage.clear();
    }

    return {
        type: "IS_AUTH",
        payload: value
    }
}