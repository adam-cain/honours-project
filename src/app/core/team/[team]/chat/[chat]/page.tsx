import { Title } from "@/components/PageComponents";

export default function Page({ params }: { params: { team: string, chat: string } }) {
    return (<>
        <Title>{params.chat} Overview</Title>
    </>
    )
}