import { Link } from 'react-router-dom';
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">FoodShare</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Connecting surplus food with communities in need. Together, we can end hunger and reduce waste.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Donor Portal
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Recipient Portal
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Impact Report
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Food Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Tax Deduction Info
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Partner Stories
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            &copy; {new Date().getFullYear()} FoodShare. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/60">
            <Link to="#" className="hover:text-background transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:text-background transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-background transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
