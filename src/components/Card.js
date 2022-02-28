import React, {useEffect, useState} from 'react';
const Card = ({site}) => {

    const [status, setStatus] = useState(null)
    const [req, setReq] = useState(0)

    function send() {
        const options = {
            method: "GET",
            mode: "no-cors"
        }

        fetch(`http://${site}`, options)
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                console.log(doc, site)
                setStatus(true)
                setReq(req + 1)
            }).catch(e => {
            setStatus(false)
            console.log('ERROR!', e)
        })
    }


    useEffect(() => {
        send()
    },[req])
    setInterval(send(), 5000)

    return (
        <div className="flex space-a border">
            <div className="site">
                <h5>{site}</h5>
            </div>
            <h5 style={{color: status ? "green" : "red"}}>{status ? "Online" : "Offline"}</h5>
            <h5>{req}</h5>
        </div>
    );
};
export default Card;