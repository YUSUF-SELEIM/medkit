import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Pharmacy</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Your health is our priority
        </p>
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <Image
            src="/images/pharmacy.jpg"
            alt="Pharmacy interior"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </section>

      {/* Patient Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">For Patients</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Login</CardTitle>
              <CardDescription>Access your patient account</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Manage your prescriptions, view your health records, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/login/patient">Login as Patient</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Patient Registration</CardTitle>
              <CardDescription>Create a new patient account</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Join our pharmacy to access online services and manage your
                health.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/register/patient">Register as Patient</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Prescription Filling", image: "one.jpg" },
            { title: "Health Consultations", image: "two.jpg" },
            { title: "Vaccinations", image: "three.jpg" },
          ].map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={`/images/${service.image}`}
                    alt={service.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Professional and reliable {service.title.toLowerCase()}{" "}
                  services provided by our expert team.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What Our Patients Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: "John Doe",
              text: "The online prescription refill service has made managing my medications so much easier!",
            },
            {
              name: "Jane Smith",
              text: "I appreciate the friendly and knowledgeable staff. They always take the time to answer my questions.",
            },
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{testimonial.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>&quot;{testimonial.text}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Admin and Pharmacist Login (Hidden by default) */}
      <section className="mb-12">
        <details className="cursor-pointer">
          <summary className="text-2xl font-semibold mb-4">Staff Login</summary>
          <div className="grid md:grid-cols-2 gap-6 mt-4">       
            <Card>
              <CardHeader>
                <CardTitle>Pharmacist Login</CardTitle>
                <CardDescription>Access pharmacist dashboard</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/login/pharmacist">Login as Pharmacist</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </details>
      </section>
    </div>
  );
}
