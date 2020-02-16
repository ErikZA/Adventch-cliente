export enum loginEnum {
    LOGIN = 'LOGIN',
    FORGOT = 'FORGOT'
}

export const IsLogin = (value: boolean) => {
    if (!value) {
        localStorage.clear();
    }

    return {
        type: loginEnum.LOGIN,
        payload: value
    }
};

