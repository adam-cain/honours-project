export default function Page({ params }: { params: { org: string } }) {
    return <h1>My Page: {params.org}</h1>
}