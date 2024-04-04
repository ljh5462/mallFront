import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loginPost } from "../api/member";
import { getCookie, removeCookie, setCookie } from "../util/utilCookie";

const initState = {
    email: ''
}
const loadMemberCookie = () => {
    const memberInfo = getCookie("member");

    //닉네임 처리
    if(memberInfo && memberInfo.nickname){
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
    }

    return memberInfo;
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    return loginPost(param);
})

const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState: loadMemberCookie() || initState, // 쿠키가 없다면 초깃값 사용
    reducers: {
        login: (state, action) => {
            console.log("login...")

            //{email, pw로 구성}
            const data = action.payload;

            //새로운 상태
            return {email: data.email}
        },
        logout: (state, action) => {
            console.log("logout...")
            removeCookie("member");
            return {...initState};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
            console.log('fulfilled');

            const payload = action.payload;

            //정상적인 로그인시에만 쿠키 저장
            if(!payload.error){
                setCookie("member", JSON.stringify(payload), 1);
            }
            return payload;
        })
        .addCase(loginPostAsync.pending, (state, action) => {
            console.log('pending')
        })
        .addCase(loginPostAsync.rejected, (state, action) => {
            console.log('rejected')
        })
    }
})

export const {login, logout} = loginSlice.actions;

export default loginSlice.reducer;