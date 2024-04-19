// export {default as AI} from './ai'
import { createConfiguredAI } from '@/components/ChatBot/ai';
import ChatComponent from '@/components/ChatBot/chat-component';
import { Config } from "./type/config"; 

export default function ChatBot({ name, session, config }: { name: string; session: any; config: Config | undefined}) { 
    const AI = createConfiguredAI(config);
    return (
        <AI>
            <ChatComponent name={name} session={session} />
        </AI>
    );
}