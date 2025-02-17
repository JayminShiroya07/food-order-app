import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config){
    const response = await fetch(url,config);

    const resData = await response.json();

    if(!response.ok){
        throw new Error(
            resData.message || 'Somthing went wrong. faild to send request..'
        );
    }

    return resData;
}

export default function useHttp(url, config, initialData){

    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error,setError] = useState(false);


    function clearData() {
        setData(initialData);
    }

    const sendRequest =  useCallback(async function sendRequest(data){
        setIsLoading(true);
        try{
            const resDate = await sendHttpRequest(url, {...config, body: data});
            setData(resDate);
        }
        catch(error){
            setError(error.message || 'somthing went wrong!');
        }
        setIsLoading(false);
    },[url, config]);

    useEffect(()=>{
        if((config && (config.method === 'GET' || !config.method)) || !config){
            sendRequest();
        }
    },[sendRequest])

    return {
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    }

}