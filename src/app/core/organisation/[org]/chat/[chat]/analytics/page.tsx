export default function Page({ params }: { params: { org: string, chat: string } }) {
    return (<>
    <h1>Org: {params.org}</h1>
    <h1>Chat: {params.chat}</h1>
    </>
    )
}