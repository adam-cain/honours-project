export default function Page({ params }: { params: { org: string, chat: string } }) {
    return (<>
        <h1>My Org: {params.org}</h1>
        <h1>My Chat: {params.chat}</h1>
    </>
    )
}