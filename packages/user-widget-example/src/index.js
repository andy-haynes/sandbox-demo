import React from 'react';
import * as nearApi from 'near-api-js';
import { useNearSocialApi } from 'widget-api';

const SEND_NEAR_RECIPIENT_ID = 'vmpoc.testnet';
const SEND_NEAR_SENDER_ID = 'gornt.testnet';

function getAccount(accountId) {
    return new nearApi.Account(nearApi.Connection.fromConfig({
        networkId: 'testnet',
        provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.testnet.near.org' } },
        signer: { type: 'InMemorySigner', args: { keyStore: {} } },
    }), accountId);
}

export default function () {
    const [accountId, setAccountId] = React.useState(SEND_NEAR_RECIPIENT_ID);
    const [balance, setBalance] = React.useState(null);
    const [localStorageSecret, setLocalStorageSecret] = React.useState('uninitialized LocalStorage secret');
    const [windowError, setWindowError] = React.useState(null);

    const {
        getRequests,
        sendNear,
    } = useNearSocialApi({
        onRequestError: (e) => setWindowError(e.toString()),
        onSendNear: {
            onSuccess: async () => {
                setBalance((await getAccount(accountId).getAccountBalance()).total)
            },
            onFailure: (e) => console.error(e),
        },
    });

    // attempt to access LocalStorage
    React.useEffect(() => {
        try {
            setLocalStorageSecret(localStorage.getItem('secret'));
        } catch (e) {
            setLocalStorageSecret(e.message);
        }
    }, []);

    React.useEffect(() => {
        async function initializeAccount() {
            setBalance((await getAccount(accountId).getAccountBalance()).total);
        }

        initializeAccount();
    }, [accountId]);

    return (
        <div style={{ color: '#3cb' }}>
            {windowError && <p style={{ color: 'red' }}>{windowError.toString()}</p>}
            <p>{accountId}</p>
            <p>{balance}</p>
            <p>{localStorageSecret}</p>
            <input type='text' value={accountId} onChange={(e) => setAccountId(e.target.value)} />
            <button
                onClick={() => sendNear({
                    senderId: SEND_NEAR_SENDER_ID,
                    recipientId: accountId,
                    amount: 10,
                })}
            >
                send money
            </button>
            <ul>
                {Object.entries(getRequests()).map(([id, { type, status }], i) => (<li key={i}>{`${id}:${type}:${status}`}</li>))}
            </ul>
        </div>
    );
}
