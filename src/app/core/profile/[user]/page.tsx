export default function Page({ params }: { params: { team: string } }) {
  return <h1>will show the profile of requested user {params.team}</h1>
}