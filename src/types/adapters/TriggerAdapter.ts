import fromUnixTime from 'date-fns/fromUnixTime';

import { ServerTrigger, Trigger } from '../Trigger';

export const toTrigger = (serverTrigger: ServerTrigger): Trigger => {
    return {
        id: serverTrigger.id || '',
        hostName: serverTrigger.hostName || '',
        created: serverTrigger.ctime ? fromUnixTime(serverTrigger.ctime / 1000) : new Date(Date.now())
    };
};

export const toTriggers = (serverTriggers: Array<ServerTrigger> | undefined): Trigger[] => {
    return serverTriggers ? serverTriggers.map(toTrigger) : [];
};
