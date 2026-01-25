'use client';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import { ShoppingBag, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <Heading size="lg">Vendor Hub</Heading>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">
                <ButtonText>Login</ButtonText>
              </Button>
            </Link>
            <Link href="/signUp">
              <Button>
                <ButtonText>Sign Up</ButtonText>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Heading size="3xl" className="mb-4 text-gray-900">
              Grow Your Business with Our Vendor Platform
            </Heading>
            <Text className="text-xl text-gray-600 mb-8">
              Reach millions of customers, manage your inventory, and track your sales in real-time. Everything you need to succeed as a vendor.
            </Text>
            <div className="flex gap-4">
              <Link href="/signUp">
                <Button size="lg">
                  <ButtonText>Get Started</ButtonText>
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  <ButtonText>Sign In</ButtonText>
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FeatureBox icon={<ShoppingBag className="w-8 h-8" />} title="Easy Management" description="Manage products and orders effortlessly" />
            <FeatureBox icon={<TrendingUp className="w-8 h-8" />} title="Real-time Analytics" description="Track your sales and performance" />
            <FeatureBox icon={<Users className="w-8 h-8" />} title="Customer Support" description="24/7 dedicated support team" />
            <FeatureBox icon={<BarChart3 className="w-8 h-8" />} title="Growth Tools" description="Marketing and promotion features" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading size="2xl" className="mb-4">Why Join Our Platform?</Heading>
            <Text className="text-lg text-gray-600">Powerful tools designed specifically for vendors</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Complete Control" 
              description="Manage your products, prices, inventory, and fulfillment all in one place"
            />
            <FeatureCard 
              title="Payment Management" 
              description="Secure payments, transparent commissions, and reliable payouts"
            />
            <FeatureCard 
              title="Marketing Support" 
              description="Access promotional tools and analytics to grow your sales"
            />
            <FeatureCard 
              title="Performance Tracking" 
              description="Detailed insights into your business metrics and customer behavior"
            />
            <FeatureCard 
              title="Professional Dashboard" 
              description="Intuitive dashboard designed for efficient vendor operations"
            />
            <FeatureCard 
              title="Global Reach" 
              description="Access to our growing customer base and international markets"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading size="2xl" className="text-white mb-4">Ready to Start Selling?</Heading>
          <Text className="text-xl text-blue-100 mb-8">Join thousands of successful vendors on our platform</Text>
          <Link href="/signUp">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <ButtonText className='bg-red'>Create Vendor Account</ButtonText>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">V</span>
                </div>
                <span className="text-lg font-bold">Vendor Hub</span>
              </div>
              <Text className="text-gray-400 text-sm">Your trusted platform for online selling</Text>
            </div>
            <div>
              <Heading size="sm" className="text-white mb-4">Quick Links</Heading>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
                <li><Link href="/signUp" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="#" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <Heading size="sm" className="text-white mb-4">Support</Heading>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <Heading size="sm" className="text-white mb-4">Legal</Heading>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Vendor Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureBox({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-blue-600 mb-3">{icon}</div>
      <Text className="font-semibold text-gray-900 mb-2">{title}</Text>
      <Text className="text-sm text-gray-600">{description}</Text>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
      <Heading size="md" className="mb-2 text-gray-900">{title}</Heading>
      <Text className="text-gray-600">{description}</Text>
    </div>
  );
}
