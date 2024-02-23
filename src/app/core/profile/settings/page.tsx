import { Title } from "@/components/PageComponents";

export default function Page({ params }: { params: { org: string } }) {

  return(
    <>
      <Title>Settings</Title>
      <h1>Org: {params.org}</h1>
    </>
  )
}