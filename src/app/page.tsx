import {
  Header,
  Hero,
  AscendFramework,
  Products,
  SocialProof,
  FinalCTA,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AscendFramework />
        <Products />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
