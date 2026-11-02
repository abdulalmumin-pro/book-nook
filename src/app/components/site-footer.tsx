import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/app/components/social-icons";

const socialLinks = [
  { href: "/", label: "Facebook", Icon: FacebookIcon },
  { href: "/", label: "X (Twitter)", Icon: XIcon },
  { href: "/", label: "Instagram", Icon: InstagramIcon },
  { href: "/", label: "YouTube", Icon: YoutubeIcon },
  { href: "/", label: "LinkedIn", Icon: LinkedinIcon },
];

const contactInfo = [
  { icon: Mail, label: "hello@booknook.com", href: "mailto:hello@booknook.com" },
  { icon: Phone, label: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "123 Library Lane, Booktown, BK 10001", href: undefined },
];

async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const copyrightYear = await getCopyrightYear();
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <BookOpen className="size-6 text-primary" />
            <span className="text-lg tracking-tight">BookNook</span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            BookNook is your online library for discovering new reads, borrowing
            favorites, and sharing great books with a community of readers.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Contact us</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {contactInfo.map(({ icon: Icon, label, href }) => {
              const content = (
                <span className="inline-flex items-center gap-2">
                  <Icon className="size-4 shrink-0" />
                  {label}
                </span>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="transition-colors hover:text-foreground"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Follow us</h2>
          <div className="flex gap-2">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <p className="mx-auto w-full max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          © {copyrightYear} BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
