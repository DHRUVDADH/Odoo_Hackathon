import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { ArrowRight, Recycle, Users, Leaf, Star, Heart, Shirt } from "lucide-react"

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
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="container relative py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Leaf className="mr-2 h-3 w-3" />
                  Sustainable Fashion
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Give Your Clothes a <span className="text-primary">Second Life</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Join our community of eco-conscious fashion lovers. Swap, trade, and discover amazing pre-loved
                  clothing while reducing textile waste.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg" asChild>
                  <Link href="/items">
                    Start Swapping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg bg-transparent" asChild>
                  <Link href="/items">Browse Items</Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-lg" asChild>
                  <Link href="/add-item">
                    <Shirt className="mr-2 h-5 w-5" />
                    List an Item
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="glass-effect rounded-2xl p-6 transform rotate-3">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Fashion item"
                      width={200}
                      height={200}
                      className="rounded-lg w-full"
                    />
                  </div>
                  <div className="glass-effect rounded-2xl p-6 transform -rotate-2">
                    <Image
                      src="/placeholder.svg?height=150&width=200"
                      alt="Fashion item"
                      width={200}
                      height={150}
                      className="rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="glass-effect rounded-2xl p-6 transform -rotate-1">
                    <Image
                      src="/placeholder.svg?height=180&width=200"
                      alt="Fashion item"
                      width={200}
                      height={180}
                      className="rounded-lg w-full"
                    />
                  </div>
                  <div className="glass-effect rounded-2xl p-6 transform rotate-2">
                    <Image
                      src="/placeholder.svg?height=160&width=200"
                      alt="Fashion item"
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
            <h2 className="text-3xl lg:text-4xl font-bold">Why Choose ReWear?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts making a positive impact on the environment
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
                  Reduce textile waste and promote circular fashion by giving clothes a second life
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
                  Connect with like-minded individuals who share your passion for sustainable fashion
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
                  Earn points for every item you share and redeem them for amazing finds
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
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Items</h2>
              <p className="text-xl text-muted-foreground">Discover amazing pre-loved fashion from our community</p>
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
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className="absolute top-3 left-3" variant="secondary">
                      {item.condition}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">by {item.user}</p>
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
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join our growing community of eco-conscious fashion lovers and make a positive impact today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <Link href="/signup">Join ReWear Today</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/items">Explore Items</Link>
            </Button>
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
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-muted-foreground">Sustainable fashion through community-driven clothing exchange.</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/items" className="block text-muted-foreground hover:text-foreground">
                  Browse Items
                </Link>
                <Link href="/add-item" className="block text-muted-foreground hover:text-foreground">
                  List an Item
                </Link>
                <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Guidelines
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Support
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
