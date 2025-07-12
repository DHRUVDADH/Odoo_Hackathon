import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import {
  ArrowRight,
  Recycle,
  Users,
  Leaf,
  Star,
  Heart,
  Shirt,
} from "lucide-react";

export default function LandingPage() {
  const featuredItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      category: "Outerwear",
      condition: "Excellent",
      points: 45,
      image: "/placeholder.svg?height=300&width=300",
      user: "Sarah M.",
    },
    {
      id: 2,
      title: "Designer Summer Dress",
      category: "Dresses",
      condition: "Like New",
      points: 60,
      image: "/placeholder.svg?height=300&width=300",
      user: "Emma K.",
    },
    {
      id: 3,
      title: "Casual Cotton T-Shirt",
      category: "Tops",
      condition: "Good",
      points: 25,
      image: "/placeholder.svg?height=300&width=300",
      user: "Alex R.",
    },
    {
      id: 4,
      title: "Wool Winter Coat",
      category: "Outerwear",
      condition: "Very Good",
      points: 80,
      image: "/placeholder.svg?height=300&width=300",
      user: "Maria L.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#f4fcf6] dark:bg-neutral-900">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="container relative py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant="secondary"
                className="mb-6 px-6 py-2 rounded-full text-base font-medium bg-[#e6fae9] text-green-700 dark:bg-neutral-800 dark:text-green-300"
              >
                <Leaf className="inline-block mr-2 h-4 w-4 text-green-600 dark:text-green-300" />
                Sustainable Fashion Revolution
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-green-900 dark:text-green-200">
                Give Your Clothes a{" "}
                <span className="text-green-600 dark:text-green-400">
                  Second Life
                </span>
              </h1>
              <p className="text-lg md:text-xl text-green-800 max-w-2xl mx-auto mb-8 dark:text-green-100">
                Join thousands of fashion lovers who are reducing waste and
                discovering unique pieces through our sustainable clothing
                exchange platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-neutral-900"
                  asChild
                >
                  <Link href="/items">Start Swapping</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-green-600 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-200 dark:hover:bg-neutral-800"
                  asChild
                >
                  <Link href="/items">Browse Items</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-200">
                    10K+
                  </div>
                  <div className="text-green-700 text-base dark:text-green-300">
                    Items Swapped
                  </div>
                </div>
                <div className="w-8 h-1 bg-green-200 rounded-full hidden sm:block dark:bg-green-900"></div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-200">
                    5K+
                  </div>
                  <div className="text-green-700 text-base dark:text-green-300">
                    Happy Users
                  </div>
                </div>
                <div className="w-8 h-1 bg-green-200 rounded-full hidden sm:block dark:bg-green-900"></div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-200">
                    2.5T
                  </div>
                  <div className="text-green-700 text-base dark:text-green-300">
                    CO₂ Saved
                  </div>
                </div>
              </div>
            </div>
            {/* Hero Image Collage - use provided images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="glass-effect rounded-2xl p-6 transform rotate-3">
                    <Image
                      src="/images/white-floral-shirt.jpg"
                      alt="White floral shirt"
                      width={200}
                      height={200}
                      className="rounded-lg w-full"
                    />
                  </div>
                  <div className="glass-effect rounded-2xl p-6 transform -rotate-2">
                    <Image
                      src="/images/beige-shoe.jpg"
                      alt="Beige shoe"
                      width={200}
                      height={150}
                      className="rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="glass-effect rounded-2xl p-6 transform -rotate-1">
                    <Image
                      src="/images/blue-floral-shirt.jpg"
                      alt="Blue floral shirt"
                      width={200}
                      height={180}
                      className="rounded-lg w-full"
                    />
                  </div>
                  <div className="glass-effect rounded-2xl p-6 transform rotate-2">
                    <Image
                      src="/images/green-daisy-bag.jpg"
                      alt="Green daisy bag"
                      width={200}
                      height={160}
                      className="rounded-lg w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Why Choose ClosetLoop?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts making a positive impact on
              the environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Sustainable Impact</h3>
                <p className="text-muted-foreground">
                  Reduce textile waste and promote circular fashion by giving
                  clothes a second life
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community Driven</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals who share your passion
                  for sustainable fashion
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Points System</h3>
                <p className="text-muted-foreground">
                  Earn points for every item you share and redeem them for
                  amazing finds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Featured Items
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover amazing pre-loved fashion from our community
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/items">View All Items</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge
                      className="absolute top-3 left-3"
                      variant="secondary"
                    >
                      {item.condition}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {item.user}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.category}</Badge>
                      <div className="flex items-center space-x-1 text-primary font-semibold">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{item.points} pts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-200 via-yellow-100 to-green-400 dark:from-green-900 dark:via-green-800 dark:to-yellow-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="650"
              cy="100"
              r="120"
              fill="#34d399"
              fillOpacity="0.2"
            />
            <circle
              cx="200"
              cy="350"
              r="180"
              fill="#facc15"
              fillOpacity="0.15"
            />
            <circle
              cx="400"
              cy="200"
              r="250"
              fill="#10b981"
              fillOpacity="0.08"
            />
          </svg>
        </div>
        <div className="container flex justify-center items-center min-h-[340px] relative z-10">
          <div className="mx-auto max-w-2xl w-full bg-white/90 dark:bg-neutral-900/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-8 border border-green-200 dark:border-green-800 backdrop-blur-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full shadow-lg mb-2 animate-pulse">
                <Recycle className="h-12 w-12 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-green-900 dark:text-green-200 text-center drop-shadow-lg">
                Ready to Start Your Sustainable Fashion Journey?
              </h2>
              <p className="text-lg md:text-xl text-green-800 dark:text-green-100 text-center max-w-xl">
                Join our growing community of eco-conscious fashion lovers and
                make a positive impact today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full mt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white shadow-lg dark:bg-green-500 dark:hover:bg-green-400 dark:text-neutral-900 rounded-full transition-transform hover:scale-105"
                asChild
              >
                <Link href="/signup">Join ClosetLoop Today</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-green-600 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-200 dark:hover:bg-neutral-800 rounded-full transition-transform hover:scale-105"
                asChild
              >
                <Link href="/items">Explore Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Recycle className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ClosetLoop</span>
              </div>
              <p className="text-muted-foreground">
                Sustainable fashion through community-driven clothing exchange.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/items"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Browse Items
                </Link>
                <Link
                  href="/add-item"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  List an Item
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Guidelines
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Support
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 ClosetLoop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
