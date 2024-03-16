import { Title } from "@/components/PageComponents";

export default function Page({ params }: { params: { team: string } }) {

  return(
    <>
      <Title>Settings</Title>
      <h1>Team: {params.team}</h1>
    </>
  )
}