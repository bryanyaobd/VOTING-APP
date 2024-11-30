import Link from 'next/link'
export default function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
      <footer className="border-t mt-auto py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {currentYear} PollAndVoteApp. Tous droits réservés.
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <Link href="/privacy">Confidentialité</Link>
              <Link href="/terms">Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }