export default function Footer({ offset = true }: { offset?: boolean }) {
  return (
    <footer
      className={`bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center px-lg py-xs z-30 ${
        offset ? "sticky bottom-0 left-0 w-full" : "w-full"
      }`}
    >
      <span className="font-label-caps text-label-caps text-on-surface-variant">HIPAA Compliant Session</span>
      <div className="flex gap-lg">
        <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-opacity" href="#">
          Encrypted Connection
        </a>
        <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-opacity" href="#">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
