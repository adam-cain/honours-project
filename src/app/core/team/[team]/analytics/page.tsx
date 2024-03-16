import { Title } from "@/components/PageComponents"

export default function Page({ params }: { params: { team: string } }) {
    return(<>
    <Title>Analytics</Title>
    <h1>My Page: {params.team}</h1>
    </>) 
}