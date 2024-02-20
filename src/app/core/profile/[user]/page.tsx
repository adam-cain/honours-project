export default function Page({ params }: { params: { org: string } }) {
  return <h1>will show the profile of requested user {params.org}</h1>
}