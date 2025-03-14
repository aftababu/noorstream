import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={
        16
      } />
      <Button variant={"default"} className="bg-primary">Click me</Button>
      <Button variant={"secondary"}>Click me</Button>
      <Button variant={"destructive"}>Click me</Button>
      <Button variant={"outline"}>Click me</Button>
    </div>
  );
}
