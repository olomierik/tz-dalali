import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export const HeroSearch = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("sale");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ type });
    if (location) params.set("q", location);
    if (maxPrice) params.set("maxPrice", maxPrice);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-background/95 backdrop-blur shadow-luxe rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_auto] gap-3 border border-gold/20"
    >
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="h-12 bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sale">For Sale</SelectItem>
          <SelectItem value="rent">For Rent</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Location, neighborhood, or address"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="h-12 bg-background"
      />

      <Input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="h-12 bg-background"
      />

      <Button type="submit" variant="gold" size="lg" className="h-12">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
};
