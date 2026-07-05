import React from "react";
import { Navbar } from "@/features/navigation/Navbar";
import { Hero } from "@/features/home/Hero";
import { Trust } from "@/features/home/Trust";
import { ShowcaseFeatured } from "@/features/showcase/ShowcaseFeatured";
import { Services } from "@/features/home/Services";
import { Process } from "@/features/home/Process";
import { ContactInvite } from "@/features/contact/ContactInvite";
import { Footer } from "@/features/navigation/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden w-full max-w-full">
        <Hero />
        <Trust />
        <ShowcaseFeatured />
        <Services />
        <Process />
        <ContactInvite />
      </main>
      <Footer />
    </>
  );
}
