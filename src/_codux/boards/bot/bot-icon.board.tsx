import React from 'react';
import { createBoard } from '@wixc3/react-board';
import BotIcon from '../../../components/icons/navIcons/bot';

export default createBoard({
    name: 'BotIcon',
    Board: () => <BotIcon />,
    isSnippet: true,
});
