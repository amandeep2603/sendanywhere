import axios from "axios";


export const fetcher = axios.create({
    baseURL:process.env.NEXT_PUBLIC_CORE_API,
    headers:{
        "Content-type":"multipart/form-data"
    }
})