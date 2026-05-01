"use client";

export function GoogleMap({ location }: { location: string }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
        <p className="text-gray-400 text-sm">Google Maps API key missing</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`}
        allowFullScreen
      ></iframe>
    </div>
  );
}
