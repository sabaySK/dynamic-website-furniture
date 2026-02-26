import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-foreground text-background relative">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-center py-2.5">
        <p className="font-body text-xs sm:text-sm text-center">
          <span className="font-semibold">Winter Sale</span> — Up to 30% off select pieces.{" "}
          <Link
            to="/shop"
            className="underline underline-offset-2 hover:text-primary transition-colors font-medium"
          >
            Shop Now →
          </Link>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 p-1 text-background/50 hover:text-background transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
