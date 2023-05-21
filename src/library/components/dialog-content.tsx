import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGameInfo } from "@/lib/api";
import { firestoreOperations } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const reviewSchema = z.object({
  review: z
    .string()
    .max(160, { message: "Review should be no longer than 160 characters" }),
});

function ReviewForm({ id }: { id: string }) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    mode: "all",
    resolver: zodResolver(reviewSchema),
  });
  const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
    await firestoreOperations.addReview(id, data.review);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write a short review</FormLabel>
                <FormControl>
                  <Textarea placeholder="Great game" {...field} />
                </FormControl>
                <FormMessage>
                  {form.getFieldState(field.name).error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2">
            Submit review
          </Button>
        </form>
      </Form>
    </>
  );
}

export function CardDialog({
  firebaseId,
  title,
  review,
}: {
  firebaseId: string;
  title: string;
  review?: string;
}) {
  const { data: gameInfo } = useGameInfo(title);
  const game = gameInfo?.find(({ name }) => name === title);
  return game ? (
    <>
      <div className="flex gap-4 flex-wrap w-full">
        <Image
          width={250}
          height={250}
          src={game?.imageUrl ?? ""}
          alt={`${title} poster`}
        />
        <div className="flex flex-col gap-2">
          <Label>Completion time</Label>
          <div className="flex gap-2">
            <Badge>Main: {game.gameplayMain}</Badge>
            <Badge>Main + Extra: {game.gameplayMainExtra}</Badge>
            <Badge>Completionist: {game.gameplayCompletionist}</Badge>
          </div>
          <Label>Platforms</Label>
          <div className="flex gap-2 flex-wrap">
            {game.platforms.map((platform: string) => (
              <Badge className="whitespace-nowrap" key={platform}>
                {platform}
              </Badge>
            ))}
          </div>
          {review ? (
            <>
              <Label>Review</Label>
              <p>{review}</p>
            </>
          ) : (
            <ReviewForm id={firebaseId} />
          )}
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="flex gap-4 flex-wrap w-full">
        <Skeleton className="w-[250px] h-[250px]" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
          <Skeleton className="w-full h-4" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
        </div>
      </div>
    </>
  );
}
