import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"
import ENVIROMENT from "../enviroment"
import { GET, getUnnauthenticatedHeaders } from "../Fetching/http.fetching"

const usemessageDetail = (message_id) =>{
    const [message_detail_state, setmessageDetailState] = useState(null)
    const [message_detail_loading, setmessageDetailLoading] = useState(true)
    const [message_detail_error, setmessageDetailError] = useState(null)
    const navigate = useNavigate()
    const getmessageDetail = async (message_id) =>{
        const message_detail_response = await GET(
            `${ENVIROMENT.URL_BACK}/api/messages/${message_id}`, 
            {
                headers: getUnnauthenticatedHeaders()
            }
        )
        setmessageDetailLoading(false)
        if(message_detail_response.ok){
            setmessageDetailState(message_detail_response.payload.message)
        }   
        else{
            //navigate('/home')

            setmessageDetailError(message_detail_response.payload.detail)
        }
    }

    useEffect(
        () =>{
            getmessageDetail(message_id)
        },
        []
    )
    return {
        message_detail_state, 
        message_detail_loading, 
        message_detail_error
    }
}

export default usemessageDetail