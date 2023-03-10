import React from 'react';

export function useNearSocialApi({
    onRequestError,
    onSendNear,
 }) {
    React.useEffect(() => {
        window.messaging = {
            requests: {},
        };

        async function processEvent(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.id && !getRequest(data.id)) {
                    return;
                }

                if (data.type === 'moneySent') {
                    removeRequest(data.id);
                    await onSendNear.onSuccess();
                } else if (data.type === 'messageReceived') {
                    getRequest(data.id).status = 'received';
                }
            } catch (e) {
                console.error(e);
            }
        }

        window.addEventListener('message', processEvent);
        return () => window.removeEventListener('message', processEvent);
    }, []);

    const [requests, setRequests] = React.useState((window.messaging || { requests: {} }).requests);

    const getRequest = (id) => window.messaging.requests[id];
    const addRequest = ({ payload, type }) => {
        const request = { payload, requestedAt: (new Date()).valueOf(), status: 'requested', type };
        window.messaging.requests[payload.id] = request;
        setRequests({
            ...requests,
            [payload.id]: request,
        });
    };
    const removeRequest = (id) => {
        delete window.messaging.requests[id];
        setRequests({
            ...window.messaging.requests,
        });
    };

    function generateId() {
        return Math.round(Math.random() * 10000).toString() + '-' + (new Date()).valueOf();
    }

    const sendNear = ({ senderId, recipientId, amount }) => {
        try {
            const id = generateId();
            const payload = {
                id,
                type: 'sendMoney',
                senderId,
                recipientId,
                amount,
            };

            console.log('sending message', { id });
            addRequest({ payload, type: 'sendMoney' });
            window.parent.postMessage(JSON.stringify(payload), '*');
        } catch (e) {
            onSendNear.onFailure(e);
        }
    };

    const getRequests = () => requests;

    return {
        getRequests,
        sendNear,
    };
}
