import { Title } from "@/components/PageComponents";

export default function Page({ params }: { params: { org: string, chat: string } }) {
    return (<>
        <Title>{params.chat} Settings</Title>
    </>
    )
}