import {
  Header,
  Hero,
  TrustBar,
  Problem,
  Solution,
  Testimonials,
  Proof,
  About,
  EmailCapture,
  CareerCoaching,
  FinalCTA,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <Testimonials />
        <Proof />
        <About />
        <EmailCapture />
        <CareerCoaching />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
