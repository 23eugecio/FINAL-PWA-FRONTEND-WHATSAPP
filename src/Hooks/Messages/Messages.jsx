import React from 'react'
import './Messages.css'
import '../../App.css'



const Messages = (props) => {
    const messageClass = props.author === 'yo' ? 'message-right' : 'message-left'
    return (
        <div className={`data ${messageClass}`}>
            <div className="author">
                {props.author}
            </div>

            <div className="content">
                {props.content}
            </div>

            <div className="date-status">
                {props.date} {props.status}
            </div>
        </div>
    )
}

export default Messages;
