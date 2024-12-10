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
    <>
      <header className="bg-primary text-primary-foreground shadow-lg">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex">
              <Image
                src="/images/logo.png"
                alt="Pharmacist"
                width={32}
                height={32}
                className="h-8 w-8 mr-2"
              />
              <Link href="/" className="text-2xl font-bold">
                Med<span className="text-red-800">Kit</span>
              </Link>
            </div>
            <ul className="flex space-x-4">
              <li>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Med<span className="text-red-800">Kit</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your health is our priority
          </p>
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
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
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Access your patient account</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Manage your prescriptions, view your health records, and more.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Registration</CardTitle>
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
                  <Link href="/register">Register</Link>
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
              <Card key={index} className="shadow-lg">
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

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About MedKit</h3>
                <p>
                  Your trusted pharmacy for all your healthcare needs.
                  We&apos;re committed to providing quality service and care.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p>123 Pharmacy Street</p>
                <p>Healthville, MED 12345</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: info@medkit.com</p>
              </div>
              <Image
                src="/images/logo.png"
                width={32}
                height={32}
                alt="Pharmacist"
                className="mr-2 animate-heartbeat"
              />
            </div>
            <div className="mt-8 text-center">
              <p>
                &copy; {new Date().getFullYear()} MedKit. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
