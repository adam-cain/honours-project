export default function Page({ params }: { params: { org: string } }) {
    console.log(params.org);
    return <h1>My Page: {params.org}</h1>
}
