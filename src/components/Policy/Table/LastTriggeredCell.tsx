import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { add, format, formatDistanceToNow, isAfter } from 'date-fns';
import * as React from 'react';
import { style } from 'typestyle';

import { Messages } from '../../../properties/Messages';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { DisabledPolicyIcon, EnabledPolicyIcon } from '../../Icons';

interface LastTriggeredCellProps extends OuiaComponentProps {
    isEnabled: boolean;
    lastTriggered: Date | undefined;
}

const lastTriggeredTextClassName = style({
    marginLeft: 10
});

export const LastTriggeredCell: React.FunctionComponent<LastTriggeredCellProps> = (props) => {
    let lastTriggeredString;
    if (props.lastTriggered) {
        const oneMonthAfterLastTriggered = add(props.lastTriggered, { months: 1 });
        const now = new Date(Date.now());
        if (isAfter(now, oneMonthAfterLastTriggered)) {
            lastTriggeredString = format(props.lastTriggered, 'dd MMM yyyy');
        } else {
            lastTriggeredString = `${formatDistanceToNow(props.lastTriggered)} ${Messages.components.lastTriggeredCell.ago}`;
        }
    } else {
        lastTriggeredString = Messages.components.lastTriggeredCell.never;
    }

    return (
        <div { ...getOuiaProps('Policy/Table/LastTriggered', props) }>
            { props.isEnabled ? <EnabledPolicyIcon /> : <DisabledPolicyIcon />}
            <span className={ lastTriggeredTextClassName }>
                { lastTriggeredString }
            </span>
        </div>
    );
};
