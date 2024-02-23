import { Title } from "@/components/PageComponents"

export default function Page({ params }: { params: { org: string } }) {
    return(<>
    <Title>Analytics</Title>
    <h1>My Page: {params.org}</h1>
    </>) 
}