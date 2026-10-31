import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

/** Loading skeleton shown while the New Arrivals query streams in. */
export function NewArrivalsSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="h-full">
          <Card className="h-full">
            <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
            <CardHeader className="gap-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="h-8 w-full animate-pulse rounded bg-muted" />
            </CardContent>
            <CardFooter>
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
