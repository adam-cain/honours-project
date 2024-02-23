import { Title } from "@/components/PageComponents";

export default function Page({ params }: { params: { org: string, chat: string } }) {
    return (<>
    <Title>{params.chat} Settings</Title>
    <h1>Org: {params.org}</h1>
    <h1>Chat: {params.chat}</h1>
    </>
    )
}